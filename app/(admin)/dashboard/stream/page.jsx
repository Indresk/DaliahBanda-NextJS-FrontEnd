import { requirePageRole } from '@/back/utils/sessionGuard';
import { DASHBOARD_ROLES, USER_ROLES } from '@/shared/constants';
import { formatDateTime } from '@/shared/utils/format';
import StreamStatusService from '@/back/services/streamStatus.service';
import KickCredentialsService from '@/back/services/kickCredentials.service';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';
import KickActions from '../_components/KickActions';

const OAUTH_MESSAGES = {
	connected: { tone: 'text-emerald-400', text: 'Kick conectado y suscripción creada.' },
	error: {
		tone: 'text-red-400',
		text: 'No se pudo completar la conexión con Kick. Inténtalo de nuevo.',
	},
};

export default async function StreamPage({ searchParams }) {
	const user = await requirePageRole(DASHBOARD_ROLES);
	const canEdit = user.role === USER_ROLES.ADMIN;
	const { kick: oauthResult } = await searchParams;

	const [stream, kick] = await Promise.all([
		StreamStatusService.getAdminStatus(),
		KickCredentialsService.getStatus(),
	]);
	const oauthMessage = OAUTH_MESSAGES[oauthResult];

	return (
		<>
			<PageTitle
				title='Transmisión'
				description='Estado en vivo que alimenta el banner del sitio y la página /live.'
			/>

			{oauthMessage && (
				<p role='status' className={`mb-6 text-sm ${oauthMessage.tone}`}>
					{oauthMessage.text}
				</p>
			)}

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card
					title='Estado actual'
					action={
						<Badge tone={stream.isLive ? 'live' : 'neutral'}>
							{stream.isLive ? 'En vivo' : 'Sin transmisión'}
						</Badge>
					}>
					<dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm'>
						<dt className='text-lightgray'>Título</dt>
						<dd>{stream.title ?? '—'}</dd>
						<dt className='text-lightgray'>Inicio</dt>
						<dd>{formatDateTime(stream.startedAt)}</dd>
						<dt className='text-lightgray'>Fin</dt>
						<dd>{formatDateTime(stream.endedAt)}</dd>
						<dt className='text-lightgray'>Último evento</dt>
						<dd>{formatDateTime(stream.lastEventAt)}</dd>
					</dl>
					{stream.storedIsLive && !stream.isLive && (
						<p className='mt-4 text-sm text-amber-400'>
							El último evento marcaba &quot;en vivo&quot; hace más de 12 horas sin un
							evento de cierre; se muestra como sin transmisión.
						</p>
					)}
				</Card>

				<Card
					title='Conexión con Kick'
					action={
						<Badge tone={kick.connected ? 'ok' : 'warn'}>
							{kick.connected ? 'Conectado' : 'Sin conectar'}
						</Badge>
					}>
					<dl className='mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm'>
						<dt className='text-lightgray'>Conectado desde</dt>
						<dd>{formatDateTime(kick.connectedAt)}</dd>
						<dt className='text-lightgray'>Token renovado</dt>
						<dd>{formatDateTime(kick.tokenUpdatedAt)}</dd>
					</dl>
					<KickActions connected={kick.connected} canEdit={canEdit} />
				</Card>
			</div>
		</>
	);
}
