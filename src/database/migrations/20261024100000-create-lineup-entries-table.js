'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Línea del tiempo de la formación (miembros actuales y anteriores)
		await queryInterface.createTable('lineup-entries', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// Opcional: si la persona es un miembro con página propia se enlaza a ella
			memberId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: { model: 'members', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			personName: { type: Sequelize.STRING(120), allowNull: false },
			role: { type: Sequelize.STRING(120), allowNull: false },
			startYear: { type: Sequelize.INTEGER, allowNull: false },
			// null = sigue en la banda
			endYear: { type: Sequelize.INTEGER, allowNull: true },
			note: { type: Sequelize.STRING(300), allowNull: true },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});

		await queryInterface.addIndex('lineup-entries', ['startYear', 'id'], {
			name: 'lineup_entries_start',
		});
		// Índice de la clave foránea (ON DELETE SET NULL recorre las entradas del miembro)
		await queryInterface.addIndex('lineup-entries', ['memberId'], {
			name: 'lineup_entries_member',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('lineup-entries');
	},
};
