'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra los miembros (con enlaces e imágenes de apoyo) desde src/database/seed-data/members.json
// (export del dashboard). Solo inserta los que faltan (por slug) y vincula su etiqueta de galería
// (`galleryPersonSlug`) si existe y aún no tiene miembro. Se ejecuta a mano con `pnpm db:seed:members`.
const { inTransaction, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { members } = readSeedData('members');

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp, missing }) => {
			const knownSlugs = new Set((await query('SELECT slug FROM "members"')).map((row) => row.slug));
			const newMembers = missing(members, knownSlugs, 'slug');
			if (!newMembers.length) return;

			await queryInterface.bulkInsert(
				'members',
				newMembers.map(({ links, images, galleryPersonSlug, ...member }) => stamp(member)),
				options,
			);

			const ids = new Map(
				(await query('SELECT id, slug FROM "members"')).map((row) => [row.slug, row.id]),
			);
			const children = (key) =>
				newMembers.flatMap((member) =>
					member[key].map((child) => stamp({ ...child, memberId: ids.get(member.slug) })),
				);

			const links = children('links');
			if (links.length) await queryInterface.bulkInsert('member-links', links, options);
			const images = children('images');
			if (images.length) await queryInterface.bulkInsert('member-images', images, options);

			for (const member of newMembers.filter((item) => item.galleryPersonSlug)) {
				await queryInterface.sequelize.query(
					'UPDATE "gallery-people" SET "memberId" = :memberId WHERE slug = :slug AND "memberId" IS NULL',
					{
						replacements: { memberId: ids.get(member.slug), slug: member.galleryPersonSlug },
						transaction: options.transaction,
					},
				);
			}
		});
	},

	async down() {},
};
