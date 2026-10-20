'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra los flyers desde src/database/seed-data/flyers.json (export del dashboard).
// Solo inserta los que faltan (por URL). Se ejecuta a mano con `pnpm db:seed:flyers`.
const { inTransaction, insertChunks, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { flyers } = readSeedData('flyers');

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp, missing }) => {
			const knownUrls = new Set((await query('SELECT url FROM "flyers"')).map((row) => row.url));
			const rows = missing(flyers, knownUrls, 'url').map(stamp);

			await insertChunks(queryInterface, 'flyers', rows, options);
		});
	},

	async down() {},
};
