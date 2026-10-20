import 'server-only';

import AppError from '../errors/app.error';

// Repositorio de las filas hijas de una entidad (enlaces, imágenes de apoyo, recursos): crear,
// actualizar y eliminar por id. `parentKey` es la clave foránea hacia el padre ("memberId").
// `duplicateError` (opcional) es el código de error cuando se viola una restricción única.
export function childRepository(Model, parentKey, { duplicateError } = {}) {
	const mapError = (error) =>
		duplicateError && error.original?.code === '23505' ? new AppError(duplicateError) : error;

	return class {
		static async findById(id) {
			return await Model.findByPk(id, { raw: true });
		}

		static async create(fields) {
			try {
				const row = await Model.create(fields);
				return row.toJSON();
			} catch (error) {
				throw mapError(error);
			}
		}

		static async update(id, fields) {
			try {
				const [count, rows] = await Model.update(fields, { where: { id }, returning: true });
				return count ? rows[0].toJSON() : null;
			} catch (error) {
				throw mapError(error);
			}
		}

		static async delete(id) {
			return await Model.destroy({ where: { id } });
		}

		static async countByParent(parentId) {
			return await Model.count({ where: { [parentKey]: parentId } });
		}
	};
}
