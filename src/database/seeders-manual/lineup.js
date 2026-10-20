'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra la línea del tiempo de la formación desde src/database/seed-data/lineup.json (export del
// dashboard). Solo inserta las entradas que faltan (persona + rol + año de inicio) y enlaza al miembro
// por `memberSlug` si existe. Se ejecuta a mano con `pnpm db:seed:lineup`.
const { inTransaction, insertChunks, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { entries } = readSeedData('lineup');
		const keyOf = (entry) => `${entry.personName}|${entry.role}|${entry.startYear}`;

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp }) => {
			const known = new Set(
				(await query('SELECT "personName", role, "startYear" FROM "lineup-entries"')).map(keyOf),
			);
			const memberIds = new Map(
				(await query('SELECT id, slug FROM "members"')).map((row) => [row.slug, row.id]),
			);
			const rows = entries
				.filter((entry) => !known.has(keyOf(entry)))
				.map(({ memberSlug, ...entry }) =>
					stamp({ ...entry, memberId: memberIds.get(memberSlug) ?? null }),
				);

			await insertChunks(queryInterface, 'lineup-entries', rows, options);
		});
	},

	async down() {},
};
