import 'server-only';

import { USER_ROLES } from '../../shared/constants';
import { errorMiddleware } from '../middlewares/error.middleware';
import { jsonDownloadResponse } from './jsonDownload';
import { requireRole } from './sessionGuard';

// Handler GET de una ruta de descarga JSON para seed (solo admin): `build` devuelve los datos
export function createExportRoute(section, build) {
	return async function GET() {
		try {
			await requireRole([USER_ROLES.ADMIN]);
			return jsonDownloadResponse(section, await build());
		} catch (error) {
			return errorMiddleware(error);
		}
	};
}
