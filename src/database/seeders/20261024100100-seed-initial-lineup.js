'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Carga inicial (una sola vez) de la línea del tiempo desde seed-data/lineup.json. Corre después
// de la carga de miembros para poder enlazarlos. Para actualizarla después usa `pnpm db:seed:lineup`.
const lineup = require('../seeders-manual/lineup');
const { seedDataExists } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		if (seedDataExists('lineup')) await lineup.up(queryInterface, Sequelize);
	},

	async down() {},
};
