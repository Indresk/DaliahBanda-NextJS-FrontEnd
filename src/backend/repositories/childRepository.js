import 'server-only';

import { baseRepository } from './baseRepository';

// Repositorio de las filas hijas de una entidad (enlaces, imágenes de apoyo, recursos): lo común
// más contar las del padre. `parentKey` es la clave foránea hacia el padre ("memberId") y
// `errorRules` las reglas de errores de Postgres (ver translatePgError).
export function childRepository(Model, parentKey, errorRules) {
	return class extends baseRepository(Model, errorRules) {
		static async countByParent(parentId) {
			return await Model.count({ where: { [parentKey]: parentId } });
		}
	};
}
