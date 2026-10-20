import { z } from 'zod';

// Se normaliza (espacios y mayúsculas) antes de validar el formato
export const emailSchema = z
	.string({ error: 'El correo no es válido.' })
	.trim()
	.toLowerCase()
	.pipe(z.email({ error: 'El correo no es válido.' }));

export const uuidSchema = z.uuid({ error: 'El identificador no es válido.' });
