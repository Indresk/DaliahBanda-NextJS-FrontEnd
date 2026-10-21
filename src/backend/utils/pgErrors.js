import 'server-only';

import AppError from '../errors/app.error';

// Códigos de error de Postgres que la aplicación traduce a errores propios
export const PG_ERROR_CODES = Object.freeze({
	UNIQUE_VIOLATION: '23505',
	FOREIGN_KEY_VIOLATION: '23503',
	// ON DELETE RESTRICT lanza este (NO ACTION lanza el de clave foránea)
	RESTRICT_VIOLATION: '23001',
});

const codeOf = (error) => error?.original?.code ?? error?.parent?.code;

export const isUniqueViolation = (error) => codeOf(error) === PG_ERROR_CODES.UNIQUE_VIOLATION;

export const isForeignKeyViolation = (error) =>
	[PG_ERROR_CODES.FOREIGN_KEY_VIOLATION, PG_ERROR_CODES.RESTRICT_VIOLATION].includes(codeOf(error));

// Traduce un error de la base de datos a un AppError según reglas por entidad; cualquier otro
// error se devuelve tal cual. Se usa con `throw translatePgError(error, rules)`.
//  unique              código cuando se viola una restricción única
//  uniqueByConstraint  { <fragmento del nombre de la restricción>: código } para distinguir varias
//  foreignKey          código cuando se viola una clave foránea (referencia inexistente o en uso)
export function translatePgError(error, { unique, uniqueByConstraint = {}, foreignKey } = {}) {
	if (isUniqueViolation(error)) {
		const constraint = error.original?.constraint ?? '';
		const match = Object.entries(uniqueByConstraint).find(([part]) => constraint.includes(part));
		const code = match?.[1] ?? unique;
		if (code) return new AppError(code);
	}
	if (foreignKey && isForeignKeyViolation(error)) return new AppError(foreignKey);

	return error;
}
