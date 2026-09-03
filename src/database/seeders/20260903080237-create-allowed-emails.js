'use strict';

const allowedEmails = JSON.parse(process.env.ALLOWED_EMAILS);
const emailsParsed = allowedEmails.map((item) => {
	return {
		email: item,
	};
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('allowed-emails', emailsParsed, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('allowed-emails', { email: allowedEmails });
	},
};
