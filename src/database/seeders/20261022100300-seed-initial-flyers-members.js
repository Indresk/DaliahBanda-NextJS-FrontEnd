'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Carga inicial (una sola vez: sequelize-cli registra los seeders ejecutados) de flyers y
// miembros desde seed-data/. Para actualizarlos después usa `pnpm db:seed:flyers` / `db:seed:members`.
const flyers = require('../seeders-manual/flyers');
const members = require('../seeders-manual/members');
const { seedDataExists } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		if (seedDataExists('flyers')) await flyers.up(queryInterface, Sequelize);
		if (seedDataExists('members')) await members.up(queryInterface, Sequelize);
	},

	async down() {},
};
