'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const now = new Date();
		await queryInterface.bulkInsert(
			'users',
			[
				{
					googleId: null,
					email: process.env.ADMIN_EMAIL,
					role: 'admin',
					createdAt: now,
					updatedAt: now,
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			'users',
			{
				email: process.env.ADMIN_EMAIL,
			},
			{},
		);
	},
};
