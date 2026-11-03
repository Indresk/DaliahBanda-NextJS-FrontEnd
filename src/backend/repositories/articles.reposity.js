import 'server-only';

import { Op, QueryTypes, literal } from 'sequelize';
import sequelize from '../config/db';
import { ARTICLE_STATUS } from '../../shared/constants';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Member } from '../models/members.model';
import { Article, ArticleAuthor, ArticleTagLink } from '../models/articles.model';
import { baseRepository } from './baseRepository';

const PUBLISHED = { status: ARTICLE_STATUS.PUBLISHED };
const NEWEST_FIRST = [
	['publishedAt', 'DESC'],
	['id', 'DESC'],
];

// Tarjeta del listado (sin el contenido: no se carga el HTML de cada artículo para pintar una lista)
const CARD_ATTRIBUTES = [
	'id', 'slug', 'title', 'synopsis',
	'imageUrl', 'imageWidth', 'imageHeight', 'imageAlt',
	'displayDate', 'publishedAt', 'readingMinutes',
];

// Recomendados y anterior/siguiente: solo lo necesario para enlazar y mostrar la miniatura
const LINK_ATTRIBUTES = ['id', 'slug', 'title', 'imageUrl', 'imageWidth', 'imageHeight', 'imageAlt', 'displayDate'];

// Autores de varios artículos de una vez, con el nombre y el slug de su miembro (si lo hay)
const authorsOf = (articleIds) =>
	ArticleAuthor.findAll({
		where: { articleId: articleIds },
		include: [{ model: Member, as: 'member', attributes: ['slug', 'name', 'active'], required: false }],
		order: [
			['displayOrder', 'ASC'],
			['id', 'ASC'],
		],
	});

// Etiquetas de varios artículos de una vez
const tagsOf = (articleIds) =>
	sequelize.query(
		`SELECT l."articleId", t.id, t.slug, t.name
		   FROM "article-tag-links" l
		   JOIN "article-tags" t ON t.id = l."tagId"
		  WHERE l."articleId" = ANY($1::int[])
		  ORDER BY t.name ASC`,
		{ bind: [articleIds], type: QueryTypes.SELECT },
	);

// Agrupa filas por artículo: Map<articleId, fila[]>
function groupBy(rows, key) {
	const groups = new Map();
	for (const row of rows) groups.set(row[key], [...(groups.get(row[key]) ?? []), row]);
	return groups;
}

class ArticlesRepository extends baseRepository(Article, {
	unique: ERROR_CODES.ARTICLE_ALREADY_EXISTS,
}) {
	// Dashboard: todos los artículos (borradores incluidos) con sus etiquetas, sin el contenido
	static async findAllForDashboard() {
		return await Article.findAll({
			attributes: [
				'id', 'slug', 'title', 'status', 'displayDate', 'publishedAt', 'updatedAt',
				[
					literal(
						`(SELECT COALESCE(ARRAY_AGG(t.name ORDER BY t.name), '{}')
						    FROM "article-tag-links" l JOIN "article-tags" t ON t.id = l."tagId"
						   WHERE l."articleId" = "articles"."id")`,
					),
					'tagNames',
				],
			],
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC'],
			],
			raw: true,
		});
	}

	// Dashboard: un artículo completo con sus etiquetas y autores
	static async findByIdWithRelations(id) {
		const article = await Article.findByPk(id, { raw: true });
		if (!article) return null;

		const [tags, authors] = await Promise.all([tagsOf([id]), authorsOf([id])]);
		return { ...article, tags, authors: authors.map((author) => author.toJSON()) };
	}

	// Página de artículos publicados (todos o los de una etiqueta) con sus etiquetas y autores. Usa
	// OFFSET porque las páginas tienen número en la URL; el índice (status, publishedAt, id) evita
	// ordenar y la tabla es pequeña.
	static async findPublicPage({ tagId = null, limit, offset }) {
		const where = {
			...PUBLISHED,
			...(tagId && {
				id: { [Op.in]: literal(`(SELECT "articleId" FROM "article-tag-links" WHERE "tagId" = ${Number(tagId)})`) },
			}),
		};
		const [articles, total] = await Promise.all([
			Article.findAll({ attributes: CARD_ATTRIBUTES, where, order: NEWEST_FIRST, limit, offset, raw: true }),
			Article.count({ where }),
		]);

		return { articles: await ArticlesRepository.attachRelations(articles), total };
	}

	// Artículo publicado por slug con contenido, etiquetas y autores (null si no existe o es borrador)
	static async findPublicBySlug(slug) {
		const article = await Article.findOne({
			attributes: [...CARD_ATTRIBUTES, 'content', 'updatedAt'],
			where: { slug, ...PUBLISHED },
			raw: true,
		});
		if (!article) return null;

		const [withRelations] = await ArticlesRepository.attachRelations([article]);
		return withRelations;
	}

	// Añade `tags` y `authors` a una lista de artículos con 2 consultas en total (no una por artículo)
	static async attachRelations(articles) {
		if (!articles.length) return [];

		const ids = articles.map((article) => article.id);
		const [tags, authors] = await Promise.all([tagsOf(ids), authorsOf(ids)]);
		const tagsByArticle = groupBy(tags, 'articleId');
		const authorsByArticle = groupBy(
			authors.map((author) => author.toJSON()),
			'articleId',
		);

		return articles.map((article) => ({
			...article,
			tags: tagsByArticle.get(article.id) ?? [],
			authors: authorsByArticle.get(article.id) ?? [],
		}));
	}

	// El publicado justo antes ('previous') o justo después ('next') en el orden de publicación
	static async findAdjacent({ publishedAt, id }, direction) {
		const isPrevious = direction === 'previous';
		const row = literal(
			`("articles"."publishedAt", "articles"."id") ${isPrevious ? '<' : '>'} (${sequelize.escape(publishedAt)}, ${Number(id)})`,
		);

		return await Article.findOne({
			attributes: LINK_ATTRIBUTES,
			where: { ...PUBLISHED, [Op.and]: [row] },
			order: isPrevious ? NEWEST_FIRST : [['publishedAt', 'ASC'], ['id', 'ASC']],
			raw: true,
		});
	}

	// Artículos al azar entre los publicados (todos menos `excludeId`)
	static async findRandom({ excludeId, limit }) {
		return await Article.findAll({
			attributes: LINK_ATTRIBUTES,
			where: { ...PUBLISHED, id: { [Op.ne]: excludeId } },
			order: literal('random()'),
			limit,
			raw: true,
		});
	}

	// Todos los publicados, del más reciente al más antiguo (sitemap y feed RSS)
	static async findAllPublishedForIndex() {
		return await Article.findAll({
			attributes: [...LINK_ATTRIBUTES, 'synopsis', 'publishedAt', 'updatedAt'],
			where: PUBLISHED,
			order: NEWEST_FIRST,
			raw: true,
		});
	}

	// Todos con etiquetas y autores, para exportar
	static async findAllForExport() {
		const articles = await Article.findAll({ order: [['id', 'ASC']], raw: true });
		return await ArticlesRepository.attachRelations(articles);
	}

	// Sustituye las etiquetas del artículo por `tagIds`
	static async replaceTags(articleId, tagIds, options) {
		await ArticleTagLink.destroy({ ...options, where: { articleId } });
		if (tagIds.length) {
			await ArticleTagLink.bulkCreate(
				tagIds.map((tagId) => ({ articleId, tagId })),
				options,
			);
		}
	}

	// Sustituye los autores del artículo ([{ memberId, name, kind }] en orden)
	static async replaceAuthors(articleId, authors, options) {
		await ArticleAuthor.destroy({ ...options, where: { articleId } });
		if (authors.length) {
			await ArticleAuthor.bulkCreate(
				authors.map((author, index) => ({ ...author, articleId, displayOrder: index })),
				options,
			);
		}
	}
}

export default ArticlesRepository;
