import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import DashboardService from '@/back/services/dashboard.service';
import { DASHBOARD_ROLES } from '@/shared/constants';
import { formatDateTime } from '@/shared/utils/format';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';

export const metadata = { title: 'Resumen' };

export default async function Dashboard() {
	const user = await requirePageRole(DASHBOARD_ROLES);
	const { stream, kick, community } = await DashboardService.getOverview(user.role);

	return (
		<>
			<PageTitle title='Resumen' description='Estado general del sitio.' />

			<div className='grid gap-6 md:grid-cols-2'>
				<Card title='Transmisión'>
					<div className='flex flex-wrap items-center gap-3'>
						<Badge tone={stream.isLive ? 'live' : 'neutral'}>
							{stream.isLive ? 'En vivo' : 'Sin transmisión'}
						</Badge>
						<Badge tone={kick.connected ? 'ok' : 'warn'}>
							{kick.connected ? 'Kick conectado' : 'Kick sin conectar'}
						</Badge>
					</div>
					{stream.lastEventAt && (
						<p className='mt-3 text-sm text-lightgray'>
							Último evento: {formatDateTime(stream.lastEventAt)}
						</p>
					)}
					<Link
						href='/dashboard/stream'
						className='mt-4 inline-block text-sm underline'>
						Ver detalle
					</Link>
				</Card>

				{community && (
					<Card title='Accesos y comunidad'>
						<ul className='flex flex-col gap-2 text-sm'>
							<li>
								<Link href='/dashboard/emails' className='underline'>
									{community.allowedEmailsCount} correos con acceso
								</Link>
							</li>
							<li>
								<Link href='/dashboard/subscribers' className='underline'>
									{community.activeSubscribersCount} suscriptores activos
								</Link>
							</li>
							<li>
								<Link href='/dashboard/assets' className='underline'>
									Gestionar assets
								</Link>
							</li>
						</ul>
					</Card>
				)}
			</div>
		</>
	);
}
