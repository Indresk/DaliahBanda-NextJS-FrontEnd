'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		// Las búsquedas y borrados comparan lower(email): este índice las sirve y evita duplicados que
		// solo difieran en mayúsculas (el índice único de `email` distingue mayúsculas)
		await queryInterface.sequelize.query(
			'CREATE UNIQUE INDEX allowed_emails_lower_email ON "allowed-emails" (lower("email"))',
		);
	},

	async down(queryInterface) {
		await queryInterface.sequelize.query('DROP INDEX IF EXISTS allowed_emails_lower_email');
	},
};
