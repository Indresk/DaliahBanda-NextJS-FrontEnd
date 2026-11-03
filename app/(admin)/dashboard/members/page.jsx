import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import MembersService from '@/back/services/members.service';
import { USER_ROLES } from '@/shared/constants';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';

export const metadata = { title: 'Miembros' };

export default async function MembersPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const members = await MembersService.findAll();

	return (
		<>
			<PageTitle
				title='Miembros'
				description='Integrantes de la banda: aparecen en el inicio y tendrán su propia página. Las etiquetas de la galería se vinculan desde Galería > Integrantes.'
			/>
			<Card
				title={`Miembros (${members.length})`}
				action={
					<span className='flex gap-4 font-headline text-sm uppercase'>
						<a
							href='/dashboard/members/export'
							download
							className='underline'>
							Exportar JSON (para seed)
						</a>
						<Link href='/dashboard/members/new' className='underline'>
							Nuevo miembro
						</Link>
					</span>
				}>
				<ul>
					{members.map((member) => (
						<li
							key={member.id}
							className='flex flex-wrap items-center gap-3 border-t border-black py-3'>
							<strong>{member.name}</strong>
							<span className='text-sm text-lightgray'>
								{member.instrument}
							</span>
							<Badge tone={member.active ? 'ok' : 'neutral'}>
								{member.active ? 'Publicado' : 'Oculto'}
							</Badge>
							<span className='text-xs text-lightgray'>
								/{member.slug} · Orden {member.displayOrder}
							</span>
							<Link
								href={`/dashboard/members/${member.id}`}
								className='ml-auto text-xs underline'>
								Editar
							</Link>
						</li>
					))}
				</ul>
			</Card>
		</>
	);
}
