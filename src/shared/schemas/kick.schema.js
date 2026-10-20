import { z } from 'zod';

// Fecha opcional de un evento: si viene vacía o no se puede leer, queda en null
const optionalDateSchema = z
	.string()
	.nullish()
	.transform((value) => {
		const date = value ? new Date(value) : null;
		return date && !Number.isNaN(date.getTime()) ? date : null;
	});

// Cuerpo de `livestream.status.updated`
export const kickLiveEventSchema = z.object(
	{
		is_live: z.boolean(),
		title: z.string().nullish(),
		started_at: optionalDateSchema,
		ended_at: optionalDateSchema,
		broadcaster: z.object({ user_id: z.union([z.number(), z.string()]) }),
	},
	{ error: 'Evento de Kick inválido.' },
);

// Header Kick-Event-Message-Timestamp (RFC 3339)
export const kickTimestampSchema = z
	.string({ error: 'Fecha del evento inválida.' })
	.transform((value) => new Date(value))
	.refine((date) => !Number.isNaN(date.getTime()), {
		error: 'Fecha del evento inválida.',
	});
