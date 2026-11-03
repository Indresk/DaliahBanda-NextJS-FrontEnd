import 'server-only';

import AppError from '../errors/app.error';
import { ARTICLES, ARTICLE_STATUS, AUTHOR_KINDS } from '../../shared/constants';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { articleChangesSchema, articleSchema, articleStatusSchema } from '../../shared/schemas';
import { readingMinutes } from '../../shared/utils/html';
import { slugify } from '../../shared/utils/slug';
import ArticleTagsRepository from '../repositories/articleTags.reposity';
import ArticlesRepository from '../repositories/articles.reposity';
import MembersRepository from '../repositories/members.reposity';
import { toExportRow } from '../utils/exportRow';
import successResponseWrapper from '../utils/successResponseWrapper';
import { withTransaction } from '../utils/transaction';
import { parseOrThrow } from '../utils/validate';

// Las lecturas públicas se cachean y salen serializadas: las fechas con hora se entregan siempre como texto
const toIso = (value) => (value ? new Date(value).toISOString() : null);

// Autor tal como lo ve el público: el nombre del miembro si está vinculado (siempre actual) y el slug de
// su página solo si el miembro está activo
const toPublicAuthor = (author) => ({
	name: author.member?.name ?? author.name,
	kind: author.kind,
	memberSlug: author.member?.active ? author.member.slug : null,
});

const toPublicArticle = ({ tags, authors, publishedAt, updatedAt, ...article }) => ({
	...article,
	publishedAt: toIso(publishedAt),
	...(updatedAt && { updatedAt: toIso(updatedAt) }),
	tags: tags.map(({ slug, name }) => ({ slug, name })),
	authors: authors.map(toPublicAuthor),
});

// Los autores que son miembros deben existir; se guarda siempre un nombre (el del miembro al guardar)
async function resolveAuthors(authors) {
	return await Promise.all(
		authors.map(async ({ memberId, name, kind }) => {
			if (!memberId) return { memberId: null, name, kind };

			const member = await MembersRepository.findById(memberId);
			if (!member) throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);
			return { memberId, name: member.name, kind: AUTHOR_KINDS.PERSON };
		}),
	);
}

// Etiquetas (se crean las nuevas) y autores del artículo; después se borran las etiquetas sin artículos
async function saveRelations(articleId, { tags, authors }, options) {
	const entries = tags.map((name) => ({ slug: slugify(name), name }));
	const saved = await ArticleTagsRepository.ensure(entries, options);

	await ArticlesRepository.replaceTags(articleId, saved.map((tag) => tag.id), options);
	await ArticlesRepository.replaceAuthors(articleId, authors, options);
	await ArticleTagsRepository.deleteOrphans(options);
}

// Artículos ("manifiestos"): reglas de negocio de crear, editar, publicar y las lecturas públicas
class ArticlesService {
	// ---------- Dashboard ----------

	static async findAll() {
		return await ArticlesRepository.findAllForDashboard();
	}

	// Artículo con la forma del formulario: etiquetas como nombres y autores como { memberId, name, kind }
	static async findByIdWithRelations(id) {
		const article = await ArticlesRepository.findByIdWithRelations(id);
		if (!article) return null;

		return {
			...article,
			tags: article.tags.map((tag) => tag.name),
			authors: article.authors.map(({ memberId, name, kind }) => ({ memberId, name, kind })),
		};
	}

	// Nombres de todas las etiquetas (sugerencias al escribir)
	static async listTagNames() {
		return await ArticleTagsRepository.findAllNames();
	}

	static async create(input) {
		const { tags, authors, ...fields } = parseOrThrow(articleSchema, input);
		const authorRows = await resolveAuthors(authors);

		return await withTransaction(async (transaction) => {
			const options = { transaction };
			const created = await ArticlesRepository.create(
				{
					...fields,
					readingMinutes: readingMinutes(fields.content),
					publishedAt: fields.status === ARTICLE_STATUS.PUBLISHED ? new Date() : null,
				},
				options,
			);
			await saveRelations(created.id, { tags, authors: authorRows }, options);

			return successResponseWrapper(created, 'Artículo creado');
		});
	}

	// `publishedAt` (el orden de publicación) se fija la primera vez que se publica y no vuelve a cambiar:
	// pasar a borrador y volver a publicar conserva su lugar
	static async update(id, input) {
		const { tags, authors, ...changes } = parseOrThrow(articleChangesSchema, input);
		const current = await ArticlesRepository.findById(id);
		if (!current) throw new AppError(ERROR_CODES.ARTICLE_NOT_FOUND);
		const authorRows = await resolveAuthors(authors);

		return await withTransaction(async (transaction) => {
			const options = { transaction };
			const updated = await ArticlesRepository.update(
				id,
				{
					...changes,
					readingMinutes: readingMinutes(changes.content),
					publishedAt:
						changes.status === ARTICLE_STATUS.PUBLISHED
							? (current.publishedAt ?? new Date())
							: current.publishedAt,
				},
				options,
			);
			await saveRelations(id, { tags, authors: authorRows }, options);

			return successResponseWrapper(updated, 'Artículo actualizado');
		});
	}

	// Publica o pasa a borrador sin tocar el resto de los campos
	static async setStatus(id, rawStatus) {
		const status = parseOrThrow(articleStatusSchema, rawStatus);
		const current = await ArticlesRepository.findById(id);
		if (!current) throw new AppError(ERROR_CODES.ARTICLE_NOT_FOUND);
		if (status === ARTICLE_STATUS.PUBLISHED && !current.content) {
			throw new AppError(ERROR_CODES.ARTICLE_CONTENT_REQUIRED);
		}

		const updated = await ArticlesRepository.update(id, {
			status,
			publishedAt:
				status === ARTICLE_STATUS.PUBLISHED ? (current.publishedAt ?? new Date()) : current.publishedAt,
		});
		return successResponseWrapper(
			updated,
			status === ARTICLE_STATUS.PUBLISHED ? 'Artículo publicado' : 'Artículo pasado a borrador',
		);
	}

	// Sus enlaces con etiquetas y sus autores caen en cascada; las etiquetas que queden sin artículos se borran
	static async delete(id) {
		return await withTransaction(async (transaction) => {
			const options = { transaction };
			if (!(await ArticlesRepository.delete(id, options))) {
				throw new AppError(ERROR_CODES.ARTICLE_NOT_FOUND);
			}
			await ArticleTagsRepository.deleteOrphans(options);

			return successResponseWrapper({ id }, 'Artículo eliminado');
		});
	}

	// ---------- Sitio público (solo publicados) ----------

	// Página `page` del listado, de todos los artículos o de una etiqueta. Devuelve null (la ruta
	// responde 404) si la página no existe, la etiqueta no existe o no tiene artículos publicados.
	static async getPage({ page = 1, tagSlug = null }) {
		if (!Number.isInteger(page) || page < 1) return null;

		const tag = tagSlug ? await ArticleTagsRepository.findBySlug(tagSlug) : null;
		if (tagSlug && !tag) return null;

		const { articles, total } = await ArticlesRepository.findPublicPage({
			tagId: tag?.id ?? null,
			limit: ARTICLES.PAGE_SIZE,
			offset: (page - 1) * ARTICLES.PAGE_SIZE,
		});
		const totalPages = Math.max(1, Math.ceil(total / ARTICLES.PAGE_SIZE));
		if (page > totalPages || (tag && total === 0)) return null;

		return {
			articles: articles.map(toPublicArticle),
			page,
			totalPages,
			total,
			tag: tag ? { slug: tag.slug, name: tag.name } : null,
		};
	}

	static async getBySlug(slug) {
		const article = await ArticlesRepository.findPublicBySlug(slug);
		return article ? toPublicArticle(article) : null;
	}

	// { previous, next }: el publicado justo antes y justo después (null si no hay)
	static async getNeighbors({ id, publishedAt }) {
		const [previous, next] = await Promise.all([
			ArticlesRepository.findAdjacent({ id, publishedAt }, 'previous'),
			ArticlesRepository.findAdjacent({ id, publishedAt }, 'next'),
		]);
		return { previous, next };
	}

	static async getRelated(articleId) {
		return await ArticlesRepository.findRandom({ excludeId: articleId, limit: ARTICLES.RELATED_COUNT });
	}

	static async listTags() {
		return await ArticleTagsRepository.findPublicWithCounts();
	}

	// Todos los publicados (sitemap y feed)
	static async listForIndex() {
		const articles = await ArticlesRepository.findAllPublishedForIndex();
		return articles.map(({ publishedAt, updatedAt, ...article }) => ({
			...article,
			publishedAt: toIso(publishedAt),
			updatedAt: toIso(updatedAt),
		}));
	}

	// Datos portables para volver a sembrar (ver seeders-manual/articles.js): etiquetas con su slug y los
	// autores que son miembros por su slug (los ids cambian entre bases de datos)
	static async exportData() {
		const [articles, members] = await Promise.all([
			ArticlesRepository.findAllForExport(),
			MembersRepository.findAll(),
		]);
		const memberSlugs = new Map(members.map((member) => [member.id, member.slug]));

		return {
			articles: articles.map(({ tags, authors, publishedAt, ...article }) => ({
				...toExportRow(article),
				publishedAt: toIso(publishedAt),
				tags: tags.map(({ slug, name }) => ({ slug, name })),
				authors: authors.map(({ memberId, name, kind }) => ({
					memberSlug: memberSlugs.get(memberId) ?? null,
					name,
					kind,
				})),
			})),
		};
	}
}

export default ArticlesService;
