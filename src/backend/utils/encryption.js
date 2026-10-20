import 'server-only';

import {
	createCipheriv,
	createDecipheriv,
	hkdfSync,
	randomBytes,
} from 'node:crypto';
import config from '../config/index';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { ENCRYPTION_PURPOSES } from '../../shared/constants';

const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12;
const derivedKeys = new Map();

// ENCRYPTION_KEY: 32 bytes en base64 (openssl rand -base64 32)
function getMasterKey() {
	const key = Buffer.from(config.ENCRYPTION_KEY, 'base64');
	if (key.length !== 32) {
		throw new AppError(
			ERROR_CODES.CONFIG_ERROR,
			'ENCRYPTION_KEY debe ser una clave de 32 bytes en base64 (openssl rand -base64 32)',
		);
	}
	return key;
}

// Una clave distinta por propósito (HKDF): así una misma ENCRYPTION_KEY sirve para varios
// usos sin que lo cifrado en uno pueda descifrarse o falsificarse en otro.
function getKey(purpose) {
	if (!Object.values(ENCRYPTION_PURPOSES).includes(purpose)) {
		throw new AppError(
			ERROR_CODES.INTERNAL_SERVER_ERROR,
			`Propósito de cifrado desconocido: ${purpose}`,
		);
	}

	if (!derivedKeys.has(purpose)) {
		derivedKeys.set(
			purpose,
			Buffer.from(hkdfSync('sha256', getMasterKey(), Buffer.alloc(0), purpose, 32)),
		);
	}
	return derivedKeys.get(purpose);
}

// Formato: iv.tag.cifrado (base64url). GCM autentica el contenido: si alguien lo modifica,
// decrypt lanza error en vez de devolver datos corruptos.
export function encrypt(plainText, purpose) {
	const iv = randomBytes(IV_BYTES);
	const cipher = createCipheriv(ALGORITHM, getKey(purpose), iv);
	const encrypted = Buffer.concat([
		cipher.update(plainText, 'utf8'),
		cipher.final(),
	]);

	return [iv, cipher.getAuthTag(), encrypted]
		.map((part) => part.toString('base64url'))
		.join('.');
}

export function decrypt(payload, purpose) {
	const [iv, tag, encrypted] = String(payload)
		.split('.')
		.map((part) => Buffer.from(part, 'base64url'));

	if (!iv || !tag || !encrypted) {
		throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR);
	}

	const decipher = createDecipheriv(ALGORITHM, getKey(purpose), iv);
	decipher.setAuthTag(tag);

	return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
		'utf8',
	);
}
