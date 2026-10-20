import { z } from 'zod';
import { emptyToNull, idSchema, optionalText } from './common.schema';

const yearSchema = z.coerce
	.number({ error: 'Año inválido.' })
	.int({ error: 'Año inválido.' })
	.min(1990, { error: 'Año inválido.' })
	.max(2100, { error: 'Año inválido.' });

// El nombre puede omitirse si la entrada es de un miembro: el servicio usa el del miembro
export const lineupEntrySchema = z
	.object({
		memberId: emptyToNull(idSchema.nullish()).transform((value) => value ?? null),
		personName: optionalText(120),
		role: z
			.string({ error: 'El rol es obligatorio.' })
			.trim()
			.min(1, { error: 'El rol es obligatorio.' })
			.max(120, { error: 'El rol admite hasta 120 caracteres.' }),
		startYear: yearSchema,
		// Sin año de fin = sigue en la banda
		endYear: emptyToNull(yearSchema.nullish()).transform((value) => value ?? null),
		note: optionalText(300),
	})
	.refine((entry) => entry.endYear === null || entry.endYear >= entry.startYear, {
		error: 'El año de fin no puede ser anterior al de inicio.',
		path: ['endYear'],
	});
