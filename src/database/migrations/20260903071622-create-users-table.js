'use strict';
const USER_ROLE_VALUES = ['user', 'member', 'admin'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			googleId: {
				type: Sequelize.UUID,
				allowNull: true,
				unique: true,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			role: {
				type: Sequelize.ENUM(...USER_ROLE_VALUES),
				allowNull: false,
				defaultValue: 'user',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
