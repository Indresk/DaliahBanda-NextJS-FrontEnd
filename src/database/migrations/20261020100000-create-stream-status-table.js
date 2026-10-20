'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Una sola fila (id = 1) con el último estado conocido de la transmisión
		await queryInterface.createTable('stream-status', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			isLive: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			title: { type: Sequelize.STRING, allowNull: true },
			startedAt: { type: Sequelize.DATE, allowNull: true },
			endedAt: { type: Sequelize.DATE, allowNull: true },
			// Id y fecha del último webhook aplicado: evitan duplicados y eventos desordenados
			lastEventId: { type: Sequelize.STRING, allowNull: true },
			lastEventAt: { type: Sequelize.DATE, allowNull: true },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('stream-status');
	},
};
