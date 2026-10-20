'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('gallery-events', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			title: { type: Sequelize.STRING(120), allowNull: false },
			description: { type: Sequelize.TEXT, allowNull: true },
			eventDate: { type: Sequelize.DATEONLY, allowNull: true },
			// Imagen de portada: si es null (o no está activa) se usa la más reciente del evento
			coverUrl: { type: Sequelize.STRING(500), allowNull: true },
			// Los eventos destacados ocupan los lugares grandes del índice de la galería
			isFeatured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});

		await queryInterface.addIndex('gallery-events', ['isFeatured', 'eventDate'], {
			name: 'gallery_events_featured_date',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('gallery-events');
	},
};
