import 'server-only';

import { translatePgError } from '../utils/pgErrors';

// Orden de las listas editables desde el dashboard (menor `displayOrder` primero)
export const BY_DISPLAY_ORDER = [
	['displayOrder', 'ASC'],
	['id', 'ASC'],
];

// Operaciones comunes de un repositorio sobre un modelo de Sequelize: buscar por id, crear,
// actualizar y eliminar, con los errores de Postgres traducidos con `errorRules` (ver
// translatePgError). Cada repositorio la extiende y añade solo sus consultas propias:
//   class FlyersRepository extends baseRepository(Flyer, { unique: ERROR_CODES.FLYER_ALREADY_EXISTS }) {}
// `update` devuelve la fila actualizada o null si no existe; `delete`, cuántas filas borró.
export function baseRepository(Model, errorRules = {}) {
	const translate = (error) => translatePgError(error, errorRules);

	return class BaseRepository {
		static async findById(id) {
			return await Model.findByPk(id, { raw: true });
		}

		static async create(fields, options) {
			try {
				const row = await Model.create(fields, options);
				return row.toJSON();
			} catch (error) {
				throw translate(error);
			}
		}

		static async update(id, fields, options) {
			try {
				const [count, rows] = await Model.update(fields, {
					...options,
					where: { id },
					returning: true,
				});
				return count ? rows[0].toJSON() : null;
			} catch (error) {
				throw translate(error);
			}
		}

		static async delete(id, options) {
			try {
				return await Model.destroy({ ...options, where: { id } });
			} catch (error) {
				throw translate(error);
			}
		}
	};
}
