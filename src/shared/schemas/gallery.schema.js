import { z } from 'zod';
import {
	GALLERY,
	GALLERY_CATEGORIES,
	GALLERY_MEMBER_MODES,
} from '../constants';
import { ERROR_CODES } from '../errors/error.codes';

// ---------- Piezas reutilizables ----------

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

const idSchema = z.coerce
	.number({ error: 'Identificador inválido.' })
	.int({ error: 'Identificador inválido.' })
	.positive({ error: 'Identificador inválido.' });

const categorySchema = z.enum(Object.values(GALLERY_CATEGORIES), {
	error: 'Categoría inválida.',
});

const dateSchema = z.iso.date({ error: 'Fecha inválida (AAAA-MM-DD).' });

const dimensionSchema = z.coerce
	.number({ error: 'Dimensión inválida.' })
	.int({ error: 'Dimensión inválida.' })
	.min(1, { error: 'Dimensión inválida.' })
	.max(GALLERY.MAX_DIMENSION, { error: 'Dimensión inválida.' });

const altSchema = z
	.string({ error: 'El texto alternativo no es válido.' })
	.trim()
	.max(GALLERY.MAX_ALT_LENGTH, {
		error: `El texto alternativo admite hasta ${GALLERY.MAX_ALT_LENGTH} caracteres.`,
	});

const memberSlugsSchema = z
	.array(slugSchema, { error: 'Integrantes inválidos.' })
	.max(GALLERY.MAX_MEMBERS_PER_IMAGE, { error: 'Demasiados integrantes.' })
	.transform((slugs) => [...new Set(slugs)]);

// Los formularios envían "" para un campo opcional vacío: se trata como ausente
const emptyToNull = (schema) =>
	z.preprocess((value) => (value === '' ? null : value), schema);

const optionalText = (max) =>
	z
		.string()
		.trim()
		.max(max, { error: `Admite hasta ${max} caracteres.` })
		.nullish()
		.transform((value) => value || null);

// ---------- Imágenes ----------

const imageFieldsSchema = z.object({
	url: z
		.url({ protocol: /^https$/, error: 'La URL debe ser https.' })
		.max(500, { error: 'La URL es demasiado larga.' }),
	alt: altSchema,
	category: categorySchema,
	eventId: idSchema,
	memberSlugs: memberSlugsSchema,
	width: dimensionSchema,
	height: dimensionSchema,
	takenAt: dateSchema,
	active: z.boolean({ error: 'Estado inválido.' }),
});

// Regla de negocio: una imagen publicada necesita texto alternativo (accesibilidad)
const requireAltWhenActive = (image) => !image.active || image.alt.length > 0;
const altRule = {
	path: ['alt'],
	params: { code: ERROR_CODES.GALLERY_ALT_REQUIRED },
};

export const galleryImageSchema = imageFieldsSchema
	.extend({
		alt: altSchema.default(''),
		memberSlugs: memberSlugsSchema.default([]),
		active: z.boolean().default(false),
	})
	.refine(requireAltWhenActive, altRule);

// Cambios parciales: el servicio los combina con la imagen guardada y revalida el resultado
export const galleryImageChangesSchema = imageFieldsSchema
	.omit({ url: true })
	.partial()
	.refine((changes) => Object.keys(changes).length > 0, {
		error: 'No hay cambios que guardar.',
	});

export const galleryIdsSchema = z
	.array(idSchema, { error: 'Selecciona al menos una imagen.' })
	.min(1, { error: 'Selecciona al menos una imagen.' })
	.max(GALLERY.MAX_BULK_ITEMS, {
		error: `Máximo ${GALLERY.MAX_BULK_ITEMS} imágenes por operación.`,
	})
	.transform((ids) => [...new Set(ids)]);

// Cambios masivos: sin url ni alt (cada imagen conserva el suyo); integrantes con modo
export const galleryBulkChangesSchema = z
	.object({
		active: z.boolean().optional(),
		category: categorySchema.optional(),
		eventId: idSchema.optional(),
		takenAt: dateSchema.optional(),
		members: z
			.object({
				mode: z.enum(Object.values(GALLERY_MEMBER_MODES)),
				slugs: memberSlugsSchema,
			})
			.optional(),
	})
	.refine((changes) => Object.keys(changes).length > 0, {
		error: 'No hay cambios que aplicar.',
	});

// Imágenes recién subidas al bucket que se registran en la galería en lote
export const galleryBatchSchema = z.object({
	shared: z.object({
		category: categorySchema,
		eventId: idSchema,
		memberSlugs: memberSlugsSchema.default([]),
		takenAt: dateSchema,
		alt: altSchema.default(''),
		active: z.boolean().default(false),
	}),
	items: z
		.array(
			z.object({
				url: imageFieldsSchema.shape.url,
				width: dimensionSchema,
				height: dimensionSchema,
			}),
			{ error: 'No hay imágenes.' },
		)
		.min(1, { error: 'No hay imágenes.' })
		.max(GALLERY.MAX_BULK_ITEMS, {
			error: `Máximo ${GALLERY.MAX_BULK_ITEMS} imágenes por lote.`,
		}),
});

// Contenido del cursor de paginación (se envía al navegador codificado, ver utils/cursor.js)
export const galleryCursorSchema = z.object({
	takenAt: dateSchema,
	id: z.number().int().positive(),
});

// Filtros de búsqueda (públicos y del dashboard). `cursor` es opaco (ver utils/cursor.js)
export const galleryFiltersSchema = z.object({
	category: categorySchema.optional(),
	eventId: idSchema.optional(),
	memberSlugs: z.array(slugSchema).max(12).optional(),
	// all: aparecen todos los indicados · any: aparece alguno
	memberMatch: z.enum(['all', 'any']).default('all'),
	active: z.boolean().optional(),
	search: z.string().trim().max(100).optional(),
	takenFrom: dateSchema.optional(),
	takenTo: dateSchema.optional(),
	withoutAlt: z.boolean().optional(),
	cursor: z.string().max(200).optional(),
	limit: z.coerce.number().int().min(1).max(GALLERY.MAX_PAGE_SIZE).optional(),
});

// ---------- Eventos e integrantes ----------

export const galleryEventSchema = z.object({
	slug: slugSchema,
	title: z
		.string({ error: 'El título es obligatorio.' })
		.trim()
		.min(1, { error: 'El título es obligatorio.' })
		.max(120, { error: 'El título admite hasta 120 caracteres.' }),
	description: optionalText(1000),
	eventDate: emptyToNull(dateSchema.nullish()).transform((value) => value ?? null),
	coverUrl: emptyToNull(
		z
			.url({ protocol: /^https$/, error: 'La portada debe ser una URL https.' })
			.max(500)
			.nullish(),
	).transform((value) => value ?? null),
	isFeatured: z.boolean().default(false),
});

// El slug no se edita (rompería los enlaces ya publicados)
export const galleryEventChangesSchema = galleryEventSchema.omit({ slug: true });

export const galleryPersonSchema = z.object({
	slug: slugSchema,
	name: z
		.string({ error: 'El nombre es obligatorio.' })
		.trim()
		.min(1, { error: 'El nombre es obligatorio.' })
		.max(80, { error: 'El nombre admite hasta 80 caracteres.' }),
	// true = integrante actual (aparece en los filtros públicos)
	isMember: z.boolean().default(false),
});

export const galleryPersonChangesSchema = galleryPersonSchema.omit({ slug: true });
