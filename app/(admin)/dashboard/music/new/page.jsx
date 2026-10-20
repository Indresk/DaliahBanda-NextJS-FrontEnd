import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import AlbumForm from '../_components/AlbumForm';

export const metadata = { title: 'Nuevo álbum' };

export default async function NewAlbumPage() {
	await requirePageRole([USER_ROLES.ADMIN]);

	return (
		<Card title='Nuevo álbum o sencillo'>
			<AlbumForm />
		</Card>
	);
}
