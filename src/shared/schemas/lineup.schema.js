import { z } from 'zod';
import { LINEUP_ROLES } from '../constants';
import { emptyToNull, idSchema, optionalText } from './common.schema';

const yearSchema = z.coerce
	.number({ error: 'Año inválido.' })
	.int({ error: 'Año inválido.' })
	.min(1990, { error: 'Año inválido.' })
	.max(2100, { error: 'Año inválido.' });

const monthSchema = emptyToNull(
	z.coerce
		.number({ error: 'Mes inválido.' })
		.int({ error: 'Mes inválido.' })
		.min(1, { error: 'Mes inválido.' })
		.max(12, { error: 'Mes inválido.' })
		.nullish(),
).transform((value) => value ?? null);

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
