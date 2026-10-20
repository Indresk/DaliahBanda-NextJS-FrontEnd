'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Una sola fila (id = 1). Los tokens se guardan cifrados (AES-256-GCM)
		await queryInterface.createTable('kick-credentials', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			refreshToken: { type: Sequelize.TEXT, allowNull: false },
			accessToken: { type: Sequelize.TEXT, allowNull: true },
			accessTokenExpiresAt: { type: Sequelize.DATE, allowNull: true },
			scope: { type: Sequelize.STRING, allowNull: true },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('kick-credentials');
	},
};
