import { z } from 'zod';
import { displayOrderSchema, httpsUrlSchema } from './common.schema';

const altSchema = z
	.string({ error: 'El texto alternativo es obligatorio.' })
	.trim()
	.min(1, { error: 'El texto alternativo es obligatorio.' })
	.max(500, { error: 'El texto alternativo admite hasta 500 caracteres.' });

export const flyerSchema = z.object({
	url: httpsUrlSchema,
	alt: altSchema,
	displayOrder: displayOrderSchema,
	active: z.boolean().default(true),
});

// La URL identifica el flyer y no se edita
export const flyerChangesSchema = flyerSchema.omit({ url: true });

