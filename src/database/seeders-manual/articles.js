'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra los artículos ("manifiestos") desde src/database/seed-data/articles.json (export del dashboard).
// Solo inserta los que faltan (por slug) con sus etiquetas (por slug) y sus autores (los miembros por su
// slug). Se ejecuta a mano con `pnpm db:seed:articles`.
const { inTransaction, insertChunks, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { articles } = readSeedData('articles');

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp, missing }) => {
			const knownSlugs = new Set((await query('SELECT slug FROM "articles"')).map((row) => row.slug));
			const fresh = missing(articles, knownSlugs, 'slug');
			if (!fresh.length) return;

			await insertChunks(
				queryInterface,
				'articles',
				fresh.map(({ tags, authors, ...article }) => stamp(article)),
				options,
			);
			const articleIds = new Map(
				(await query('SELECT id, slug FROM "articles"')).map((row) => [row.slug, row.id]),
			);

			// Etiquetas: se crean las que no existen y se enlazan
			const tags = new Map(fresh.flatMap((article) => article.tags).map((tag) => [tag.slug, tag]));
			const knownTags = new Set((await query('SELECT slug FROM "article-tags"')).map((row) => row.slug));
			const newTags = missing([...tags.values()], knownTags, 'slug').map(stamp);
			if (newTags.length) await queryInterface.bulkInsert('article-tags', newTags, options);
			const tagIds = new Map(
				(await query('SELECT id, slug FROM "article-tags"')).map((row) => [row.slug, row.id]),
			);
			const links = fresh.flatMap((article) =>
				article.tags.map((tag) => ({ articleId: articleIds.get(article.slug), tagId: tagIds.get(tag.slug) })),
			);
			if (links.length) await queryInterface.bulkInsert('article-tag-links', links, options);

			// Autores: los miembros se enlazan por slug (si el miembro ya no existe queda solo el nombre)
			const memberIds = new Map(
				(await query('SELECT id, slug FROM "members"')).map((row) => [row.slug, row.id]),
			);
			const authors = fresh.flatMap((article) =>
				article.authors.map(({ memberSlug, name, kind }, index) =>
					stamp({
						articleId: articleIds.get(article.slug),
						memberId: memberIds.get(memberSlug) ?? null,
						name,
						kind,
						displayOrder: index,
					}),
				),
			);
			if (authors.length) await queryInterface.bulkInsert('article-authors', authors, options);
		});
	},

	async down() {},
};
