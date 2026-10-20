import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import { formatDateTime } from '@/shared/utils/format';
import SubscribeEmailsService from '@/back/services/subscribeEmails.service';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';

export const metadata = { title: 'Suscriptores' };

const MAX_ROWS = 500;

export default async function SubscribersPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const subscribers = await SubscribeEmailsService.findAll();
	const active = subscribers.filter((item) => item.isActive).length;

	return (
		<>
			<PageTitle
				title='Suscriptores'
				description='Correos recogidos con el formulario "Mantente al tanto" del footer.'
			/>

			<Card
				title={`${active} activos de ${subscribers.length}`}
				action={
					<a
						href='/dashboard/subscribers/export'
						download
						className='font-headline text-sm uppercase underline'>
						Descargar CSV (activos)
					</a>
				}>
				<table className='w-full text-left text-sm'>
					<thead className='font-headline text-xs uppercase tracking-wider text-lightgray'>
						<tr>
							<th className='pb-2 font-normal'>Correo</th>
							<th className='pb-2 font-normal'>Estado</th>
							<th className='pb-2 font-normal'>Registrado</th>
						</tr>
					</thead>
					<tbody>
						{subscribers.slice(0, MAX_ROWS).map((item) => (
							<tr key={item.id} className='border-t border-black'>
								<td className='py-3 pr-4 break-all'>{item.email}</td>
								<td className='py-3 pr-4'>
									<Badge tone={item.isActive ? 'ok' : 'neutral'}>
										{item.isActive ? 'Activo' : 'Baja'}
									</Badge>
								</td>
								<td className='py-3 text-lightgray'>
									{formatDateTime(item.createdAt, { day: true })}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{subscribers.length > MAX_ROWS && (
					<p className='mt-4 text-xs text-lightgray'>
						Se muestran los {MAX_ROWS} más recientes. El CSV incluye todos los activos.
					</p>
				)}
			</Card>
		</>
	);
}
