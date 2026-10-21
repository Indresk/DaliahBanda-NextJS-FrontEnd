import 'server-only';

import { Sequelize } from 'sequelize';
import pg from 'pg';
import config from './index';

const dbConfig = {
	host: config.DB_HOST,
	port: config.DB_PORT,
	username: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_DATABASE,
	dialect: 'postgres',
	dialectModule: pg,
	logging: false, //console.log,
	// Conexiones por proceso: tope explícito para no agotar max_connections de Postgres
	pool: {
		max: Number(config.DB_POOL_MAX) || 10,
		min: 0,
		idle: 10_000,
		acquire: 30_000,
	},
};

// Una sola instancia (y un solo pool) por proceso: en desarrollo la recarga en caliente y, en
// producción, cada bundle de servidor evalúan este módulo otra vez y cada `new Sequelize` abriría
// su propio pool.
const globalForDb = globalThis;
const sequelize = (globalForDb.__sequelize ??= new Sequelize(dbConfig));

export default sequelize;
