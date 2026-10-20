import { z } from 'zod';
import {
	ALBUM_TYPES,
	MUSIC,
	SONG_RESOURCE_KINDS,
	STREAMING_PLATFORMS,
} from '../constants';
import {
	dimensionSchema,
	displayOrderSchema,
	emptyToNull,
	httpsUrlSchema,
	idSchema,
	optionalHttpsUrl,
	optionalText,
	slugSchema,
} from './common.schema';

const requiredText = (label, max) =>
	z
		.string({ error: `${label} es obligatorio.` })
		.trim()
		.min(1, { error: `${label} es obligatorio.` })
		.max(max, { error: `${label} admite hasta ${max} caracteres.` });

const dateSchema = z.iso.date({ error: 'Fecha inválida (AAAA-MM-DD).' });

// Portada propia de una canción: URL + dimensiones (las tres o ninguna)
const optionalDimension = emptyToNull(dimensionSchema.nullish()).transform((v) => v ?? null);
const coverIsComplete = ({ coverUrl, coverWidth, coverHeight }) => {
	const filled = [coverUrl, coverWidth, coverHeight].filter(Boolean).length;
	return filled === 0 || filled === 3;
};
const coverRule = { error: 'La portada necesita URL, ancho y alto.', path: ['coverUrl'] };

// ---------- Álbumes (y sencillos) ----------

export const albumSchema = z.object({
	slug: slugSchema,
	title: requiredText('El título', 120),
	type: z.enum(Object.values(ALBUM_TYPES), { error: 'Tipo inválido.' }),
	tagline: optionalText(200),
	description: optionalText(5000),
	coverUrl: httpsUrlSchema,
	coverWidth: dimensionSchema,
	coverHeight: dimensionSchema,
	releasedAt: dateSchema,
	active: z.boolean().default(false),
});

// El slug no se edita (forma la URL pública)
export const albumChangesSchema = albumSchema.omit({ slug: true });

// ---------- Canciones ----------

// Los formularios envían los temas como texto (uno por línea)
const themesSchema = z.preprocess(
	(value) =>
		typeof value === 'string'
			? value.split('\n').map((line) => line.trim()).filter(Boolean)
			: value,
	z
		.array(z.string().trim().min(1).max(200), { error: 'Temas inválidos.' })
		.max(MUSIC.MAX_THEMES, { error: 'Demasiados temas.' }),
);

const songFieldsSchema = z.object({
	albumId: idSchema,
	slug: slugSchema,
	title: requiredText('El título', 120),
	trackNumber: z.coerce
		.number({ error: 'Número de pista inválido.' })
		.int({ error: 'Número de pista inválido.' })
		.min(1, { error: 'Número de pista inválido.' })
		.max(999, { error: 'Número de pista inválido.' }),
	// Si falta se usa la fecha del álbum
	releasedAt: emptyToNull(dateSchema.nullish()).transform((value) => value ?? null),
	shortDescription: requiredText('La descripción corta', 300),
	longDescription: optionalText(5000),
	themes: themesSchema.default([]),
	story: optionalText(10000),
	acknowledgments: optionalText(10000),
	audioUrl: optionalHttpsUrl,
	coverUrl: optionalHttpsUrl,
	coverWidth: optionalDimension,
	coverHeight: optionalDimension,
	featured: z.boolean().default(false),
	active: z.boolean().default(false),
});

// Si no define portada propia usa la de su álbum
export const songSchema = songFieldsSchema.refine(coverIsComplete, coverRule);

// El álbum y el slug no cambian (el slug forma la URL pública)
export const songChangesSchema = songFieldsSchema
	.omit({ albumId: true, slug: true })
	.refine(coverIsComplete, coverRule);

// ---------- Enlaces de escucha (álbum o canción) y recursos de canción ----------

const linkFields = {
	platform: z.enum(Object.keys(STREAMING_PLATFORMS), { error: 'Plataforma inválida.' }),
	url: httpsUrlSchema,
	displayOrder: displayOrderSchema,
};

export const albumLinkSchema = z.object({ albumId: idSchema, ...linkFields });
export const songLinkSchema = z.object({ songId: idSchema, ...linkFields });

export const songResourceSchema = z.object({
	songId: idSchema,
	kind: z.enum(Object.values(SONG_RESOURCE_KINDS), { error: 'Tipo de recurso inválido.' }),
	label: requiredText('El nombre', 120),
	// Solo los stems se organizan por instrumento
	instrument: optionalText(80),
	url: httpsUrlSchema,
	displayOrder: displayOrderSchema,
});
