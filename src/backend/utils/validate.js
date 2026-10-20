import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

// Valida `value` con un schema de zod (src/shared/schemas) y lanza AppError si no cumple.
// El código de error sale de `params.code` de la regla que falló, de `options.code` o,
// por defecto, BAD_REQUEST con el mensaje de la regla.
export function parseOrThrow(schema, value, options = {}) {
	const result = schema.safeParse(value);
	if (result.success) return result.data;

	const [issue] = result.error.issues;
	const code = options.code ?? issue.params?.code;

	throw new AppError(
		code ?? ERROR_CODES.BAD_REQUEST,
		code ? null : (options.message ?? issue.message),
	);
}
