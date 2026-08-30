import 'server-only';
import { Sequelize } from 'sequelize';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

const dbConfig = {
	host,
	username,
	password,
	database,
	dialect,
	dialectModule,
	benchmark: true,
	logging: console.log,
};

const sequelize = new Sequelize(dbConfig);

export async function connectDB() {
	try {
		await sequelize.authenticate();
		console.log('Base de datos conectada exitosamente');

		await sequelize.sync({ alter: true });
	} catch (error) {
		throw new AppError(ERROR_CODES.DATABASE_ERROR, error);
	}
}

export default sequelize;
