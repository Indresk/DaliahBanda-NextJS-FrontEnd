import { z } from 'zod';
import { GALLERY } from '../constants';

// Se normaliza (espacios y mayúsculas) antes de validar el formato
export const emailSchema = z
	.string({ error: 'El correo no es válido.' })
	.trim()
	.toLowerCase()
	.pipe(z.email({ error: 'El correo no es válido.' }));

export const uuidSchema = z.uuid({ error: 'El identificador no es válido.' });

// Identificador legible para URL: minúsculas, números y guiones
export const slugSchema = z
	.string({ error: 'Identificador inválido.' })
	.trim()
	.toLowerCase()
	.min(1, { error: 'Identificador inválido.' })
	.max(80, { error: 'Identificador inválido.' })
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		error: 'Identificador inválido (solo minúsculas, números y guiones).',
	});

export const idSchema = z.coerce
	.number({ error: 'Identificador inválido.' })
	.int({ error: 'Identificador inválido.' })
	.positive({ error: 'Identificador inválido.' });

export const dimensionSchema = z.coerce
	.number({ error: 'Dimensión inválida.' })
	.int({ error: 'Dimensión inválida.' })
	.min(1, { error: 'Dimensión inválida.' })
	.max(GALLERY.MAX_DIMENSION, { error: 'Dimensión inválida.' });

export const httpsUrlSchema = z
	.url({ protocol: /^https$/, error: 'La URL debe ser https.' })
	.max(500, { error: 'La URL es demasiado larga.' });

// Los formularios envían "" para un campo opcional vacío: se trata como ausente
export const emptyToNull = (schema) =>
	z.preprocess((value) => (value === '' ? null : value), schema);

export const optionalText = (max) =>
	z
		.string()
		.trim()
		.max(max, { error: `Admite hasta ${max} caracteres.` })
		.nullish()
		.transform((value) => value || null);

// URL https opcional ("" o ausente = null)
export const optionalHttpsUrl = emptyToNull(httpsUrlSchema.nullish()).transform(
	(value) => value ?? null,
);

// Orden de aparición en listas editables desde el dashboard (menor = primero)
export const displayOrderSchema = z.coerce
	.number({ error: 'Orden inválido.' })
	.int({ error: 'Orden inválido.' })
	.min(0, { error: 'Orden inválido.' })
	.max(9999, { error: 'Orden inválido.' })
	.default(0);
