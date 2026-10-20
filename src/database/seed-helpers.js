'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Utilidades de los seeders que leen exports JSON del dashboard (carpeta seed-data/).
const fs = require('node:fs');
const path = require('node:path');

const SEED_DATA_DIR = path.resolve(__dirname, 'seed-data');
const CHUNK = 100;

const seedDataPath = (section) => path.join(SEED_DATA_DIR, `${section}.json`);

const seedDataExists = (section) => fs.existsSync(seedDataPath(section));

// Lee seed-data/<section>.json y comprueba que sea el export de esa sección
function readSeedData(section) {
	const file = seedDataPath(section);
	if (!fs.existsSync(file)) {
		throw new Error(`Falta ${file}: exporta "${section}" desde el dashboard y guárdalo ahí.`);
	}
	const data = JSON.parse(fs.readFileSync(file, 'utf8'));
	if (data.section !== section) {
		throw new Error(`${file} no es un export de "${section}" (section: ${data.section}).`);
	}
	return data;
}

// Ejecuta `work({ options, query, stamp, missing })` dentro de una transacción.
//  query(sql)             SELECT dentro de la misma transacción (ve lo recién insertado)
//  stamp(row)             añade createdAt/updatedAt
//  missing(rows, known, key)  filas cuyo `key` no está en el Set `known`
async function inTransaction(queryInterface, Sequelize, work) {
	const now = new Date();

	return queryInterface.sequelize.transaction(async (transaction) => {
		const query = (sql) =>
			queryInterface.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT, transaction });
		const stamp = (row) => ({ ...row, createdAt: now, updatedAt: now });
		const missing = (rows, known, key) => rows.filter((row) => !known.has(row[key]));

		return work({ options: { transaction }, query, stamp, missing });
	});
}

// Inserta en bloques (Postgres limita los parámetros por sentencia)
async function insertChunks(queryInterface, table, rows, options, attributes) {
	for (let start = 0; start < rows.length; start += CHUNK) {
		await queryInterface.bulkInsert(table, rows.slice(start, start + CHUNK), options, attributes);
	}
}

module.exports = { seedDataExists, readSeedData, inTransaction, insertChunks };
