import 'server-only';

import { USER_ROLES } from '../../shared/constants';
import AllowedEmailsService from './allowedEmails.service';
import KickCredentialsService from './kickCredentials.service';
import StreamStatusService from './streamStatus.service';
import SubscribeEmailsService from './subscribeEmails.service';

// Datos de la pantalla de resumen del dashboard. Lo que cuesta una consulta (correos y
// suscriptores) solo se pide a los admins, que son quienes lo ven.
class DashboardService {
	static async getOverview(role) {
		const isAdmin = role === USER_ROLES.ADMIN;

		const [stream, kick, allowedEmails, subscribers] = await Promise.all([
			StreamStatusService.getAdminStatus(),
			KickCredentialsService.getStatus(),
			isAdmin ? AllowedEmailsService.findAll() : null,
			isAdmin ? SubscribeEmailsService.findAll() : null,
		]);

		return {
			stream,
			kick,
			community: isAdmin
				? {
						allowedEmailsCount: allowedEmails.length,
						activeSubscribersCount: subscribers.filter((item) => item.isActive).length,
					}
				: null,
		};
	}
}

export default DashboardService;
