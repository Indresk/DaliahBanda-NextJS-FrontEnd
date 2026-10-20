import { z } from 'zod';
import { ASSET_MAX_SIZE_BYTES, ASSET_TYPES } from '../constants';
import { ERROR_CODES } from '../errors/error.codes';

// Carpeta ("prefijo") dentro del bucket: vacía o terminada en "/", sin rutas relativas
export const assetPrefixSchema = z.preprocess(
	(value) => value ?? '',
	z
		.string({ error: 'Carpeta inválida.' })
		.trim()
		.max(200, { error: 'Carpeta inválida.' })
		.refine(
			(value) =>
				value === '' ||
				(/^[a-zA-Z0-9][a-zA-Z0-9/._-]*\/$/.test(value) &&
					!value.includes('..') &&
					!value.includes('//')),
			{ error: 'Carpeta inválida.' },
		),
);

export const assetKeySchema = z
	.string({ error: 'Archivo inválido.' })
	.min(1, { error: 'Archivo inválido.' })
	.max(512, { error: 'Archivo inválido.' })
	.refine(
		(value) =>
			!value.startsWith('/') && !value.endsWith('/') && !value.includes('..'),
		{ error: 'Archivo inválido.' },
	);

// Lo que el navegador declara antes de subir un archivo directo a R2
export const assetUploadSchema = z.object({
	prefix: assetPrefixSchema,
	name: z
		.string({ error: 'Nombre de archivo inválido.' })
		.trim()
		.min(1, { error: 'Nombre de archivo inválido.' })
		.max(255, { error: 'Nombre de archivo inválido.' }),
	type: z
		.string({ error: 'Tipo de archivo inválido.' })
		.refine((value) => Object.hasOwn(ASSET_TYPES, value), {
			params: { code: ERROR_CODES.INVALID_FILE_TYPE },
		}),
	size: z
		.number({ error: 'Tamaño de archivo inválido.' })
		.refine((value) => Number.isInteger(value) && value > 0, {
			params: { code: ERROR_CODES.FILE_REQUIRED },
		})
		.refine((value) => value <= ASSET_MAX_SIZE_BYTES, {
			params: { code: ERROR_CODES.FILE_TOO_LARGE },
		}),
});
