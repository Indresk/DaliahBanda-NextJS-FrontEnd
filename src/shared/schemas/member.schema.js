import { z } from 'zod';
import { MEMBER_LINK_KINDS, RICH_TEXT } from '../constants';
import {
	dimensionSchema,
	displayOrderSchema,
	httpsUrlSchema,
	idSchema,
	optionalText,
	monthSchema,
	slugSchema,
	yearSchema,
} from './common.schema';

const requiredText = (label, max) =>
	z
		.string({ error: `${label} es obligatorio.` })
		.trim()
		.min(1, { error: `${label} es obligatorio.` })
		.max(max, { error: `${label} admite hasta ${max} caracteres.` });

export const memberSchema = z.object({
	slug: slugSchema,
	name: requiredText('El nombre', 80),
	instrument: requiredText('El instrumento', 80),
	shortBio: requiredText('La descripción corta', 300),
	longBio: optionalText(RICH_TEXT.MAX_LENGTH),
	featuredUrl: httpsUrlSchema,
	featuredWidth: dimensionSchema,
	featuredHeight: dimensionSchema,
	// Si falta, el sitio genera uno con el nombre y el instrumento
	featuredAlt: optionalText(500),
	displayOrder: displayOrderSchema,
	active: z.boolean().default(false),
});

// El slug no se edita (formará la URL de la página personal)
export const memberChangesSchema = memberSchema.omit({ slug: true });

export const memberLinkSchema = z.object({
	memberId: idSchema,
	kind: z.enum(Object.values(MEMBER_LINK_KINDS), { error: 'Tipo de enlace inválido.' }),
	label: requiredText('El nombre del enlace', 80),
	url: httpsUrlSchema,
	displayOrder: displayOrderSchema,
});

export const memberImageSchema = z.object({
	memberId: idSchema,
	url: httpsUrlSchema,
	alt: requiredText('El texto alternativo', 500),
	width: dimensionSchema,
	height: dimensionSchema,
	displayOrder: displayOrderSchema,
});


// Fecha de salida de un miembro (sin mes se asume diciembre, como en la formación)
export const memberDeparture = z.object({ endYear: yearSchema, endMonth: monthSchema });
