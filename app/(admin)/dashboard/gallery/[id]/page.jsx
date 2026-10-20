import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryEventsService from '@/back/services/galleryEvents.service';
import GalleryImagesService from '@/back/services/galleryImages.service';
import GalleryPeopleService from '@/back/services/galleryPeople.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import DeleteImageButton from '../_components/DeleteImageButton';
import GalleryImageForm from '../_components/GalleryImageForm';

export const metadata = { title: 'Editar imagen de la galería' };

export default async function EditGalleryImagePage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id } = await params;

	const imageId = Number(id);
	if (!Number.isInteger(imageId) || imageId <= 0) notFound();

	const [image, events, people] = await Promise.all([
		GalleryImagesService.findById(imageId),
		GalleryEventsService.findAll(),
		GalleryPeopleService.findAll(),
	]);
	if (!image) notFound();

	// Fechas de la fila (createdAt/updatedAt) no se envían al formulario
	const { createdAt, updatedAt, ...editable } = image;

	return (
		<Card title={`Imagen #${image.id}`}>
			<GalleryImageForm image={editable} events={events} people={people} />
			<DeleteImageButton id={image.id} />
		</Card>
	);
}
