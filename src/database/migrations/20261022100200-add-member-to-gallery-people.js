'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// gallery-people es solo una etiqueta con estado para organizar fotos; si corresponde a un
		// miembro de la banda se vincula aquí. Un miembro tiene a lo sumo una etiqueta.
		await queryInterface.addColumn('gallery-people', 'memberId', {
			type: Sequelize.INTEGER,
			allowNull: true,
			unique: true,
			references: { model: 'members', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('gallery-people', 'memberId');
	},
};
