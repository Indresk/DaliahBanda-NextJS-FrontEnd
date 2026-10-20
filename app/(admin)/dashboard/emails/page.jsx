import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import { formatDateTime } from '@/shared/utils/format';
import AllowedEmailsService from '@/back/services/allowedEmails.service';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';
import AddAllowedEmailForm from '../_components/AddAllowedEmailForm';
import RemoveAllowedEmailButton from '../_components/RemoveAllowedEmailButton';

export const metadata = { title: 'Correos permitidos' };

export default async function AllowedEmailsPage() {
	const admin = await requirePageRole([USER_ROLES.ADMIN]);
	const emails = await AllowedEmailsService.findAll();

	return (
		<>
			<PageTitle
				title='Correos permitidos'
				description='Solo estos correos de Google pueden iniciar sesión en el sitio.'
			/>

			<div className='flex flex-col gap-6'>
				<Card title='Añadir correo'>
					<AddAllowedEmailForm />
				</Card>

				<Card title={`Con acceso (${emails.length})`}>
					<table className='w-full text-left text-sm'>
						<thead className='font-headline text-xs uppercase tracking-wider text-lightgray'>
							<tr>
								<th className='pb-2 font-normal'>Correo</th>
								<th className='pb-2 font-normal'>Añadido</th>
								<th className='pb-2'>
									<span className='sr-only'>Acciones</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{emails.map((item) => (
								<tr key={item.id} className='border-t border-black'>
									<td className='py-3 pr-4 break-all'>{item.email}</td>
									<td className='py-3 pr-4 text-lightgray'>
										{formatDateTime(item.createdAt, { day: true })}
									</td>
									<td className='py-3'>
										{item.email.toLowerCase() === admin.email.toLowerCase() ? (
											<span className='block text-right text-xs text-lightgray'>
												Tú
											</span>
										) : (
											<RemoveAllowedEmailButton email={item.email} />
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Card>
			</div>
		</>
	);
}
