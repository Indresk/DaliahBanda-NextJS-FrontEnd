import 'server-only';

import { formDataToObject } from './formData';
import { guardedRequest } from './guardedRequestWrapper';

// Acciones del servidor (prevState, formData) / (id) para las operaciones de una entidad hija.
// `refresh(result)` invalida cachés y refresca el dashboard tras un cambio exitoso.
export function childActions(operations, { roles, refresh, formFields }) {
	return {
		create: async (_prevState, formData) =>
			refresh(
				await guardedRequest(roles, () =>
					operations.create(formDataToObject(formData, formFields)),
				),
			),
		update: async (_prevState, formData) => {
			const { id, ...fields } = formDataToObject(formData, formFields);
			return refresh(await guardedRequest(roles, () => operations.update(Number(id), fields)));
		},
		remove: async (id) =>
			refresh(await guardedRequest(roles, () => operations.delete(Number(id)))),
	};
}
