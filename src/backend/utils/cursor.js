import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { galleryCursorSchema } from '../../shared/schemas';
import { parseOrThrow } from './validate';

// Cursor de paginación: la posición (fecha e id) de la última imagen de la página, en base64url.
// Es opaco para el navegador y se valida al recibirlo.
export function encodeCursor({ takenAt, id }) {
	return Buffer.from(JSON.stringify({ takenAt, id })).toString('base64url');
}

export function decodeCursor(cursor) {
	try {
		const value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
		return parseOrThrow(galleryCursorSchema, value);
	} catch {
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cursor de paginación inválido.');
	}
}
