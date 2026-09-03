'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('allowed-emails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: { type: Sequelize.STRING, unique: true, allowNull: false },
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('allowed-emails');
	},
};
