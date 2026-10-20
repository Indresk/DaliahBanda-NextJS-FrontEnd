import 'server-only';

import GalleryEventsRepository from '../repositories/galleryEvents.reposity';
import GalleryImagesRepository from '../repositories/galleryImages.reposity';
import GalleryPeopleRepository from '../repositories/galleryPeople.reposity';

// Estado actual de la galería como datos portables para volver a sembrar la base:
// se referencian por slug (no por id) porque los ids cambian entre bases de datos.
class GalleryExportService {
	static async build() {
		const [people, events, images] = await Promise.all([
			GalleryPeopleRepository.findAll(),
			GalleryEventsRepository.findAll(),
			GalleryImagesRepository.findAllForExport(),
		]);
		const eventSlugs = new Map(events.map((event) => [event.id, event.slug]));

		return {
			people: people.map(({ slug, name, isMember }) => ({ slug, name, isMember })),
			events: events.map(
				({ slug, title, description, eventDate, coverUrl, isFeatured }) => ({
					slug, title, description, eventDate, coverUrl, isFeatured,
				}),
			),
			images: images.map(({ eventId, ...image }) => ({
				...image,
				eventSlug: eventSlugs.get(eventId),
			})),
		};
	}
}

export default GalleryExportService;
