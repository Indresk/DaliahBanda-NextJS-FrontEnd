import { z } from 'zod';
import { ARTICLES, ARTICLE_STATUS, AUTHOR_KINDS, RICH_TEXT } from '../constants';
import { ERROR_CODES } from '../errors/error.codes';
import { slugify } from '../utils/slug';
import {
	dimensionSchema,
	emptyToNull,
	httpsUrlSchema,
	idSchema,
	optionalText,
	slugSchema,
} from './common.schema';

const requiredText = (label, max) =>
	z
		.string({ error: `${label} es obligatorio.` })
		.trim()
		.min(1, { error: `${label} es obligatorio.` })
		.max(max, { error: `${label} admite hasta ${max} caracteres.` });

// Los formularios envían las etiquetas como texto (separadas por coma o salto de línea). Se quitan
// las repetidas (por slug: "Rock" y "rock" son la misma etiqueta).
const tagNamesSchema = z.preprocess(
	(value) =>
		typeof value === 'string' ? value.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean) : value,
	z
		.array(
			z
				.string()
				.trim()
				.min(1)
				.max(ARTICLES.MAX_TAG_LENGTH, { error: `Cada etiqueta admite hasta ${ARTICLES.MAX_TAG_LENGTH} caracteres.` })
				.refine((tag) => slugify(tag) !== '', { error: 'Etiqueta inválida.' }),
			{ error: 'Etiquetas inválidas.' },
		)
		.transform((tags) => [...new Map(tags.map((tag) => [slugify(tag), tag])).values()])
		.pipe(z.array(z.string()).max(ARTICLES.MAX_TAGS, { error: `Máximo ${ARTICLES.MAX_TAGS} etiquetas.` })),
);

// Autor: un miembro (memberId) o un nombre escrito a mano (name + si es persona u organización)
const authorSchema = z
	.object({
		memberId: emptyToNull(idSchema.nullish()).transform((value) => value ?? null),
		name: optionalText(120),
		kind: z.enum(Object.values(AUTHOR_KINDS), { error: 'Tipo de autor inválido.' }).default(AUTHOR_KINDS.PERSON),
	})
	.refine((author) => author.memberId || author.name, {
		error: 'Cada autor necesita un miembro o un nombre.',
	});

// El formulario envía los autores como JSON en un campo oculto
const authorsSchema = z.preprocess(
	(value) => {
		if (typeof value !== 'string') return value;
		if (!value.trim()) return [];
		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	},
	z.array(authorSchema, { error: 'Autores inválidos.' }).max(ARTICLES.MAX_AUTHORS, { error: `Máximo ${ARTICLES.MAX_AUTHORS} autores.` }),
);

const articleSlugSchema = slugSchema.refine((slug) => !ARTICLES.RESERVED_SLUGS.includes(slug), {
	error: 'Ese identificador está reservado por la sección.',
});

const articleFieldsSchema = z.object({
	slug: articleSlugSchema,
	title: requiredText('El título', 160),
	// Descripción del artículo: se usa como meta description, en las listas y en las redes sociales
	synopsis: requiredText('La sinopsis', 400),
	content: optionalText(RICH_TEXT.MAX_LENGTH),
	// Imagen principal: masthead (ratio fijo) y miniatura (otro ratio fijo), recortadas al mostrarse
	imageUrl: httpsUrlSchema,
	imageWidth: dimensionSchema,
	imageHeight: dimensionSchema,
	imageAlt: requiredText('El texto alternativo de la imagen', 300),
	// Fecha que se muestra al público (editable); el orden lo da publishedAt, que no se edita
	displayDate: z.iso.date({ error: 'Fecha inválida (AAAA-MM-DD).' }),
	status: z.enum(Object.values(ARTICLE_STATUS), { error: 'Estado inválido.' }).default(ARTICLE_STATUS.DRAFT),
	tags: tagNamesSchema.default([]),
	authors: authorsSchema.default([]),
});

// Un artículo publicado necesita contenido (un borrador puede estar vacío)
const contentRule = [
	(article) => article.status !== ARTICLE_STATUS.PUBLISHED || Boolean(article.content),
	{ path: ['content'], params: { code: ERROR_CODES.ARTICLE_CONTENT_REQUIRED } },
];

export const articleSchema = articleFieldsSchema.refine(...contentRule);

// El slug no se edita (forma la URL pública)
export const articleChangesSchema = articleFieldsSchema.omit({ slug: true }).refine(...contentRule);

// Cambio rápido de estado (publicar / pasar a borrador) desde la lista del dashboard
export const articleStatusSchema = z.enum(Object.values(ARTICLE_STATUS), { error: 'Estado inválido.' });
