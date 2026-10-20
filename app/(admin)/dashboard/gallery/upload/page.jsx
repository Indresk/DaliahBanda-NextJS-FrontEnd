import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryEventsService from '@/back/services/galleryEvents.service';
import GalleryPeopleService from '@/back/services/galleryPeople.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import GalleryUploadForm from '../_components/GalleryUploadForm';

export const metadata = { title: 'Subir imágenes en lote' };

export default async function UploadGalleryImagesPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const [events, people] = await Promise.all([
		GalleryEventsService.findAll(),
		GalleryPeopleService.findAll(),
	]);

	return (
		<Card title='Subir en lote'>
			<GalleryUploadForm events={events} people={people} />
		</Card>
	);
}
