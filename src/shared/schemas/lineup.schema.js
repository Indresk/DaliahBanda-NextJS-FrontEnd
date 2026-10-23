import { z } from 'zod';
import { LINEUP_ROLES } from '../constants';
import { emptyToNull, idSchema, monthSchema, optionalText, yearSchema } from './common.schema';

// El nombre puede omitirse si la entrada es de un miembro: el servicio usa el del miembro
export const lineupEntrySchema = z
	.object({
		memberId: emptyToNull(idSchema.nullish()).transform((value) => value ?? null),
		personName: optionalText(120),
		role: z.enum(Object.keys(LINEUP_ROLES), { error: 'Rol inválido.' }),
		startYear: yearSchema,
		// Sin mes se asume enero (inicio) o diciembre (fin) al dibujar el gráfico
		startMonth: monthSchema,
		// Sin año de fin = sigue en la banda
		endYear: emptyToNull(yearSchema.nullish()).transform((value) => value ?? null),
		endMonth: monthSchema,
		note: optionalText(300),
	})
	.refine((entry) => entry.endYear === null || entry.endYear >= entry.startYear, {
		error: 'El fin no puede ser anterior al inicio.',
		path: ['endYear'],
	})
	.refine((entry) => entry.endMonth === null || entry.endYear !== null, {
		error: 'Indica el año de fin si indicas su mes.',
		path: ['endYear'],
	})
	.refine(
		(entry) =>
			entry.endYear !== entry.startYear ||
			(entry.startMonth ?? 1) <= (entry.endMonth ?? 12),
		{ error: 'El fin no puede ser anterior al inicio.', path: ['endMonth'] },
	);
