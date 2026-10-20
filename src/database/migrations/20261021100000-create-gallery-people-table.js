'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Personas que aparecen en las fotos (integrantes actuales y anteriores)
		await queryInterface.createTable('gallery-people', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			name: { type: Sequelize.STRING(80), allowNull: false },
			// true = integrante actual (aparece en los filtros públicos de la galería)
			isMember: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('gallery-people');
	},
};
