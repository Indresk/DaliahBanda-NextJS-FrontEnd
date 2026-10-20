import { getGalleryEvents, getGalleryMembers } from '@/back/services/gallery.cache';
import { SITE } from '@/frontend/seo/site';

export default async function sitemap() {
	// Páginas de la galería que salen de la base de datos (eventos con fotos y integrantes)
	const [events, members] = await Promise.all([getGalleryEvents(), getGalleryMembers()]);
	const galleryPages = [
		...events.map((event) => ({
			url: `${SITE.url}/gallery/events/${event.slug}`,
			lastModified: event.eventDate ?? undefined,
			changeFrequency: 'yearly',
			priority: 0.6,
		})),
		...members.map((member) => ({
			url: `${SITE.url}/gallery/${member.slug}`,
			changeFrequency: 'monthly',
			priority: 0.5,
		})),
		{ url: `${SITE.url}/gallery/backstage`, changeFrequency: 'monthly', priority: 0.5 },
	];

	return [
		...galleryPages,
		{
			url: 'https://daliahbanda.com',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: 'https://daliahbanda.com/gallery',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://daliahbanda.com/albums',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7,
		},
		{
			url: 'https://daliahbanda.com/live',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
	];
}
