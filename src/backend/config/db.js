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
	benchmark: true,
	logging: false, //console.log,
};

const sequelize = new Sequelize(dbConfig);

export default sequelize;
