import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

// Nombre seguro para URL: minúsculas, sin acentos, espacios ni caracteres raros. La
// extensión la decide el tipo ya validado, no la que traiga el nombre original.
export function buildAssetFileName(originalName, extension) {
	const base = String(originalName ?? '')
		.replace(/\.[^.]*$/, '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

	if (!base) {
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Nombre de archivo inválido.');
	}
	return `${base}${extension}`;
}

export function buildAssetKey(prefix, originalName, extension) {
	return `${prefix}${buildAssetFileName(originalName, extension)}`;
}
