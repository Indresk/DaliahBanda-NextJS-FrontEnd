'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra la galería desde src/database/seed-data/gallery.json (export del dashboard).
// Solo inserta lo que falta (personas y eventos por slug, imágenes por URL).
// Se ejecuta a mano con `pnpm db:seed:gallery`; no forma parte de `db:seed:all`.
const { inTransaction, insertChunks, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { people, events, images } = readSeedData('gallery');

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp, missing }) => {
			const knownPeople = new Set(
				(await query('SELECT slug FROM "gallery-people"')).map((row) => row.slug),
			);
			const newPeople = missing(people, knownPeople, 'slug').map(stamp);
			if (newPeople.length) {
				await queryInterface.bulkInsert('gallery-people', newPeople, options);
			}

			const knownEvents = new Set(
				(await query('SELECT slug FROM "gallery-events"')).map((row) => row.slug),
			);
			const newEvents = missing(events, knownEvents, 'slug').map(stamp);
			if (newEvents.length) {
				await queryInterface.bulkInsert('gallery-events', newEvents, options);
			}

			const eventIds = new Map(
				(await query('SELECT id, slug FROM "gallery-events"')).map((row) => [row.slug, row.id]),
			);
			const knownUrls = new Set(
				(await query('SELECT url FROM "gallery-images"')).map((row) => row.url),
			);
			const rows = missing(images, knownUrls, 'url').map(({ eventSlug, ...image }) =>
				stamp({ ...image, eventId: eventIds.get(eventSlug) }),
			);

			await insertChunks(queryInterface, 'gallery-images', rows, options, {
				memberSlugs: { type: Sequelize.ARRAY(Sequelize.TEXT) },
			});
		});
	},

	// Sembrar no se deshace: borrar fotos de producción por error sería peor que no deshacer.
	// El `undo` solo sirve para que sequelize-cli permita repetir el seeder (ver db:seed:gallery).
	async down() {},
};
