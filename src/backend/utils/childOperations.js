import 'server-only';

import AppError from '../errors/app.error';
import successResponseWrapper from './successResponseWrapper';
import { parseOrThrow } from './validate';

// Altas, cambios y bajas de las filas hijas de una entidad (enlaces de un miembro, recursos de
// una canción...) son idénticas salvo el schema, el repositorio, el padre y el error.
//  parentKey            clave foránea hacia el padre ("memberId")
//  assertParentExists   lanza si el padre no existe (se comprueba al crear)
//  notFound             código de error cuando la fila no existe
export function childOperations({ schema, repository, parentKey, assertParentExists, notFound, label }) {
	return {
		async create(input) {
			const fields = parseOrThrow(schema, input);
			await assertParentExists(fields[parentKey]);

			return successResponseWrapper(await repository.create(fields), `${label} añadido`);
		},
		async update(id, input) {
			const { [parentKey]: _parent, ...changes } = parseOrThrow(schema, input);
			const updated = await repository.update(id, changes);
			if (!updated) throw new AppError(notFound);

			return successResponseWrapper(updated, `${label} actualizado`);
		},
		async delete(id) {
			if (!(await repository.delete(id))) throw new AppError(notFound);

			return successResponseWrapper({ id }, `${label} eliminado`);
		},
	};
}
