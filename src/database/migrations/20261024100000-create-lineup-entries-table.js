'use strict';

const ROLES = ['vocals', 'backing_vocals', 'lead_guitar', 'rhythm_guitar', 'bass', 'keys', 'drums'];

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
			// Lista fija (define el color en el gráfico); el detalle libre va en `note`
			role: { type: Sequelize.ENUM(...ROLES), allowNull: false },
			startYear: { type: Sequelize.INTEGER, allowNull: false },
			// Sin mes se asume enero (inicio) o diciembre (fin) al dibujar el gráfico
			startMonth: { type: Sequelize.INTEGER, allowNull: true },
			// endYear null = sigue en la banda
			endYear: { type: Sequelize.INTEGER, allowNull: true },
			endMonth: { type: Sequelize.INTEGER, allowNull: true },
			note: { type: Sequelize.STRING(300), allowNull: true },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});

		await queryInterface.addConstraint('lineup-entries', {
			type: 'check',
			name: 'lineup_entries_months_valid',
			fields: ['startMonth'],
			where: {
				[Sequelize.Op.and]: [
					{ [Sequelize.Op.or]: [{ startMonth: null }, { startMonth: { [Sequelize.Op.between]: [1, 12] } }] },
					{ [Sequelize.Op.or]: [{ endMonth: null }, { endMonth: { [Sequelize.Op.between]: [1, 12] } }] },
				],
			},
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
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_lineup-entries_role"');
	},
};
