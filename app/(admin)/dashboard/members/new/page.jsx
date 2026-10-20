import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import MemberForm from '../_components/MemberForm';

export const metadata = { title: 'Nuevo miembro' };

export default async function NewMemberPage() {
	await requirePageRole([USER_ROLES.ADMIN]);

	return (
		<Card title='Nuevo miembro'>
			<MemberForm />
		</Card>
	);
}
