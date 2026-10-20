'use strict';

const ROLES = ['vocals', 'backing_vocals', 'lead_guitar', 'rhythm_guitar', 'bass', 'keys', 'drums'];
const ENUM_NAME = '"enum_lineup-entries_role"';

// El rol pasa a ser una lista fija (el detalle libre vive en la nota) y las entradas ganan mes de
// inicio y de fin (opcionales) para el gráfico de la formación. Todo va en una transacción: si algún
// rol existente no se reconoce, la migración falla sin dejar la tabla a medio migrar.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async (transaction) => {
			const query = (sql) => queryInterface.sequelize.query(sql, { transaction });
			const month = { type: Sequelize.INTEGER, allowNull: true };

			await queryInterface.addColumn('lineup-entries', 'startMonth', month, { transaction });
			await queryInterface.addColumn('lineup-entries', 'endMonth', month, { transaction });
			await query(
				`ALTER TABLE "lineup-entries" ADD CONSTRAINT lineup_entries_months_valid CHECK (
					("startMonth" IS NULL OR "startMonth" BETWEEN 1 AND 12) AND
					("endMonth" IS NULL OR "endMonth" BETWEEN 1 AND 12))`,
			);

			await query(
				`CREATE TYPE ${ENUM_NAME} AS ENUM (${ROLES.map((role) => `'${role}'`).join(', ')})`,
			);
			// Conversión de los roles en texto libre que ya existan (el CASE devuelve NULL, y falla
			// la columna NOT NULL, para los que no reconozca)
			await query(
				`ALTER TABLE "lineup-entries" ALTER COLUMN "role" TYPE ${ENUM_NAME} USING (CASE
					WHEN "role" ILIKE '%melód%' OR "role" ILIKE '%melod%' THEN 'lead_guitar'
					WHEN "role" ILIKE '%rítm%' OR "role" ILIKE '%ritm%' THEN 'rhythm_guitar'
					WHEN "role" ILIKE '%voz%' THEN 'vocals'
					WHEN "role" ILIKE '%coro%' OR "role" ILIKE '%corist%' THEN 'backing_vocals'
					WHEN "role" ILIKE '%bajo%' THEN 'bass'
					WHEN "role" ILIKE '%teclad%' THEN 'keys'
					WHEN "role" ILIKE '%bater%' THEN 'drums'
				END)::${ENUM_NAME}`,
			);
		});
	},

	async down(queryInterface) {
		await queryInterface.sequelize.transaction(async (transaction) => {
			const query = (sql) => queryInterface.sequelize.query(sql, { transaction });

			await query(
				'ALTER TABLE "lineup-entries" ALTER COLUMN "role" TYPE VARCHAR(120) USING "role"::text',
			);
			await query(`DROP TYPE ${ENUM_NAME}`);
			await query('ALTER TABLE "lineup-entries" DROP CONSTRAINT lineup_entries_months_valid');
			await queryInterface.removeColumn('lineup-entries', 'endMonth', { transaction });
			await queryInterface.removeColumn('lineup-entries', 'startMonth', { transaction });
		});
	},
};
