import 'server-only';

import { internalRequestWrapper } from './internalRequestWrapper';
import { requireRole } from './sessionGuard';

// Para acciones del servidor: comprueba el rol del usuario (contra la base de datos) y
// ejecuta `work(user)`. Los errores se devuelven como objeto, igual que internalRequestWrapper.
export async function guardedRequest(allowedRoles, work) {
	return await internalRequestWrapper(async () => {
		const user = await requireRole(allowedRoles);
		return await work(user);
	});
}
