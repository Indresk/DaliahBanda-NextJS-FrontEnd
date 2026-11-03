import { requirePageRole } from '@/back/utils/sessionGuard';
import LineupService from '@/back/services/lineup.service';
import MembersService from '@/back/services/members.service';
import { USER_ROLES } from '@/shared/constants';
import PageTitle from '@/frontend/components/ui/PageTitle';
import LineupManager from './_components/LineupManager';

export const metadata = { title: 'Formación' };

export default async function LineupPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const [entries, members] = await Promise.all([
		LineupService.findAll(),
		MembersService.findAll(),
	]);

	return (
		<>
			<PageTitle
				title='Formación'
				description='Línea del tiempo de integrantes actuales y anteriores que aparece en Sobre nosotros > Integrantes.'
			/>
			<LineupManager entries={entries} members={members} />
		</>
	);
}
