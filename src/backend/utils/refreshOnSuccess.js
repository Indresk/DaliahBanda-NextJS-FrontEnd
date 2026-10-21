import 'server-only';

import { revalidatePath } from 'next/cache';

// Para acciones del servidor de un dominio: tras un resultado exitoso invalida su caché pública y
// refresca las páginas del dashboard indicadas ([ruta, tipo?]); un resultado con error pasa igual.
//   const refresh = refreshOnSuccess(invalidateMusic, ['/dashboard/music', 'layout']);
export function refreshOnSuccess(invalidate, ...paths) {
	return function refresh(result) {
		if (result.status === 'success') {
			invalidate();
			for (const [path, type] of paths) revalidatePath(path, type);
		}
		return result;
	};
}
