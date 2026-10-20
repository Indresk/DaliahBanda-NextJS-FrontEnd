import { eventsFrames } from '@/shared/lib/eventsFrames';
import { humanizeSlug } from '../buildMetadata';

export const galleryMeta = {
	title: 'Galería',
	description:
		'Fotos de los shows y eventos en vivo de Daliah Banda: Rock And Blend, Universidad San Buenaventura y más escenarios de la escena rock bogotana.',
	path: '/gallery',
};

export const galleryBackstageMeta = {
	title: 'Backstage',
	description:
		'Fotos del backstage de Daliah Banda: ensayos, camerinos y bastidores de los shows.',
	path: '/gallery/backstage',
	indexable: false,
};

export const galleryFilterMeta = (filter) => ({
	title: `Galería: ${humanizeSlug(filter)}`,
	description: `Fotos de ${humanizeSlug(filter)} en los shows de Daliah Banda.`,
	path: `/gallery/${filter}`,
	indexable: false,
});

export const galleryEventMeta = (slug) => {
	const event = eventsFrames.find(
		(item) => item.pageLink === `/gallery/events/${slug}`,
	);
	const name = event?.title ?? humanizeSlug(slug);

	return {
		title: `${name} - Fotos`,
		description: `Fotos del evento ${name}, presentación en vivo de Daliah Banda.`,
		path: `/gallery/events/${slug}`,
		indexable: false,
	};
};
