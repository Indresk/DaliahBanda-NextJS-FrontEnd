import 'server-only';
import { Sequelize } from 'sequelize';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import pg from 'pg';
import config from '.';

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

async function connectDB() {
	try {
		await sequelize.authenticate();
		console.log('Base de datos conectada exitosamente');

		await sequelize.sync({ alter: true });
	} catch (error) {
		throw new AppError(ERROR_CODES.DATABASE_ERROR, error);
	}
}
connectDB();

export default sequelize;
