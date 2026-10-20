'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Carga inicial (una sola vez) del catálogo desde seed-data/music.json. Para actualizarlo después
// usa `pnpm db:seed:music`.
const music = require('../seeders-manual/music');
const { seedDataExists } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		if (seedDataExists('music')) await music.up(queryInterface, Sequelize);
	},

	async down() {},
};
