import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
const requiredEnvs = [
	'NODE_ENV',
	'AUTH_GOOGLE_ID',
	'AUTH_GOOGLE_SECRET',
	'DB_HOST',
	'DB_PORT',
	'DB_USER',
	'DB_PASSWORD',
	'DB_DATABASE',
	'API_KEY',
];

for (const envVar of Object.values(requiredEnvs)) {
	if (!process.env[envVar]) {
		throw new AppError(
			ERROR_CODES.CONFIG_ERROR,
			`Falta la variale de entorno obligatoria: ${envVar}`,
		);
	}
}

const config = Object.fromEntries(
	requiredEnvs.map((key) => [key, process.env[key]]),
);

Object.freeze(config);

export default config;
