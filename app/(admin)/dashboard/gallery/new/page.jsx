import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryEventsService from '@/back/services/galleryEvents.service';
import GalleryImagesService from '@/back/services/galleryImages.service';
import GalleryPeopleService from '@/back/services/galleryPeople.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import GalleryImageForm from '../_components/GalleryImageForm';

export const metadata = { title: 'Añadir imagen a la galería' };

// ?url=... precarga la imagen (botón "Añadir a galería" de la sección Assets)
export default async function NewGalleryImagePage({ searchParams }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { url = '' } = await searchParams;

	const [events, people, existing] = await Promise.all([
		GalleryEventsService.findAll(),
		GalleryPeopleService.findAll(),
		url ? GalleryImagesService.findByUrl(url) : null,
	]);

	return (
		<Card title='Añadir imagen'>
			{existing && (
				<p role='status' className='mb-4 text-sm text-amber-400'>
					Esta imagen ya está en la galería.{' '}
					<Link href={`/dashboard/gallery/${existing.id}`} className='underline'>
						Editarla
					</Link>
				</p>
			)}
			<GalleryImageForm initialUrl={url} events={events} people={people} />
		</Card>
	);
}
