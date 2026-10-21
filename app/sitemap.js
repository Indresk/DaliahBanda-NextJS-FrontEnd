import { getGalleryEvents, getGalleryMembers } from '@/back/services/gallery.cache';
import { getActiveMembers } from '@/back/services/members.cache';
import { getAlbums, getSongs } from '@/back/services/music.cache';
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

	// Álbumes y canciones publicados (2 consultas en caché en total, no una por álbum)
	const [albums, songs] = await Promise.all([getAlbums(), getSongs()]);
	const musicPages = [
		...albums.map((album) => ({
			url: `${SITE.url}/albums/${album.slug}`,
			lastModified: album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.6,
		})),
		...songs.map((song) => ({
			url: `${SITE.url}/albums/${song.album.slug}/${song.slug}`,
			lastModified: song.releasedAt ?? song.album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.5,
		})),
	];

	// Páginas de los miembros activos
	const activeMembers = await getActiveMembers();
	const aboutPages = [
		{ url: `${SITE.url}/about-us`, changeFrequency: 'yearly', priority: 0.6 },
		{ url: `${SITE.url}/about-us/members`, changeFrequency: 'monthly', priority: 0.6 },
		...activeMembers.map((member) => ({
			url: `${SITE.url}/about-us/members/${member.slug}`,
			changeFrequency: 'yearly',
			priority: 0.5,
		})),
	];

	return [
		...galleryPages,
		...musicPages,
		...aboutPages,
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
