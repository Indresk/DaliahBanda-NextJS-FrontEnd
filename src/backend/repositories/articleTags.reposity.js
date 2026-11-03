import 'server-only';

import { QueryTypes } from 'sequelize';
import sequelize from '../config/db';
import { ARTICLE_STATUS } from '../../shared/constants';
import { ArticleTag } from '../models/articles.model';
import { baseRepository } from './baseRepository';

class ArticleTagsRepository extends baseRepository(ArticleTag) {
	static async findBySlug(slug) {
		return await ArticleTag.findOne({ where: { slug }, raw: true });
	}

	// Todas las etiquetas (sugerencias del formulario del dashboard)
	static async findAllNames() {
		const tags = await ArticleTag.findAll({ attributes: ['name'], order: [['name', 'ASC']], raw: true });
		return tags.map((tag) => tag.name);
	}

	// Etiquetas con artículos publicados y cuántos tienen (landing y páginas de etiqueta), un solo GROUP BY
	static async findPublicWithCounts() {
		return await sequelize.query(
			`SELECT t.id, t.slug, t.name, COUNT(*)::int AS total
			   FROM "article-tags" t
			   JOIN "article-tag-links" l ON l."tagId" = t.id
			   JOIN "articles" a ON a.id = l."articleId" AND a.status = :published
			  GROUP BY t.id
			  ORDER BY total DESC, t.name ASC`,
			{ type: QueryTypes.SELECT, replacements: { published: ARTICLE_STATUS.PUBLISHED } },
		);
	}

	// Devuelve las etiquetas de `entries` ([{ slug, name }]), creando las que no existen. Dos guardados a
	// la vez no chocan: la inserción ignora duplicados y después se vuelven a leer todas.
	static async ensure(entries, options) {
		if (!entries.length) return [];

		const slugs = entries.map((entry) => entry.slug);
		const existing = new Set(
			(await ArticleTag.findAll({ attributes: ['slug'], where: { slug: slugs }, raw: true, ...options })).map(
				(tag) => tag.slug,
			),
		);
		const missing = entries.filter((entry) => !existing.has(entry.slug));
		if (missing.length) await ArticleTag.bulkCreate(missing, { ignoreDuplicates: true, ...options });

		return await ArticleTag.findAll({ where: { slug: slugs }, raw: true, ...options });
	}

	// Borra las etiquetas que ya no tiene ningún artículo; devuelve cuántas
	static async deleteOrphans(options) {
		const [, count] = await sequelize.query(
			`DELETE FROM "article-tags" t
			  WHERE NOT EXISTS (SELECT 1 FROM "article-tag-links" l WHERE l."tagId" = t.id)`,
			{ ...options, type: QueryTypes.DELETE },
		);
		return count;
	}
}

export default ArticleTagsRepository;
