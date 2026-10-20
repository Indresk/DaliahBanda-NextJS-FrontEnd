import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryEventsService from '@/back/services/galleryEvents.service';
import { USER_ROLES } from '@/shared/constants';
import EventsManager from '../_components/EventsManager';

export const metadata = { title: 'Eventos de la galería' };

export default async function GalleryEventsPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const events = await GalleryEventsService.listWithStats();

	return <EventsManager events={events} />;
}
