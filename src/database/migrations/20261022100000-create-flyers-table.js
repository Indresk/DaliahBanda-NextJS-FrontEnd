'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('flyers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			url: { type: Sequelize.STRING(500), unique: true, allowNull: false },
			alt: { type: Sequelize.STRING(500), allowNull: false },
			displayOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
			active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});

		// El carrusel del home lee los activos por orden
		await queryInterface.addIndex('flyers', ['active', 'displayOrder', 'id'], {
			name: 'flyers_active_order',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('flyers');
	},
};
