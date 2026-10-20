import { getGalleryEvents, getGalleryMembers } from '@/back/services/gallery.cache';
import { getActiveMembers } from '@/back/services/members.cache';
import { getAlbum, getAlbums } from '@/back/services/music.cache';
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

	// Álbumes y canciones publicados
	const albums = await getAlbums();
	const albumDetails = await Promise.all(albums.map((album) => getAlbum(album.slug)));
	const musicPages = albumDetails.flatMap((album) => [
		{
			url: `${SITE.url}/albums/${album.slug}`,
			lastModified: album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		...album.songs.map((song) => ({
			url: `${SITE.url}/albums/${album.slug}/${song.slug}`,
			lastModified: song.releasedAt ?? album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.5,
		})),
	]);

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
