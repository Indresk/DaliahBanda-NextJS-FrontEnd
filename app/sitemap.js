import {
	getGalleryEvents,
	getGalleryMembers,
} from '@/back/services/gallery.cache';
import { getArticleTags, getArticlesIndex } from '@/back/services/articles.cache';
import { getActiveMembers } from '@/back/services/members.cache';
import { getAlbums, getSongs } from '@/back/services/music.cache';
import { SITE } from '@/frontend/seo/site';

export default async function sitemap() {
	// Páginas de la galería que salen de la base de datos (eventos con fotos y integrantes)
	const [events, members] = await Promise.all([
		getGalleryEvents(),
		getGalleryMembers(),
	]);
	const galleryPages = [
		...events.map((event) => ({
			url: `${SITE.url}/galeria/eventos/${event.slug}`,
			lastModified: event.eventDate ?? undefined,
			changeFrequency: 'yearly',
			priority: 0.6,
		})),
		...members.map((member) => ({
			url: `${SITE.url}/galeria/${member.slug}`,
			changeFrequency: 'monthly',
			priority: 0.5,
		})),
		{
			url: `${SITE.url}/galeria/backstage`,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	];

	// Álbumes y canciones publicados (2 consultas en caché en total, no una por álbum)
	const [albums, songs] = await Promise.all([getAlbums(), getSongs()]);
	const musicPages = [
		...albums.map((album) => ({
			url: `${SITE.url}/discografia/${album.slug}`,
			lastModified: album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.6,
		})),
		...songs.map((song) => ({
			url: `${SITE.url}/discografia/${song.album.slug}/${song.slug}`,
			lastModified: song.releasedAt ?? song.album.releasedAt,
			changeFrequency: 'yearly',
			priority: 0.5,
		})),
	];

	// Artículos publicados, sus etiquetas y la landing (las páginas numeradas no van: no aportan URLs nuevas)
	const [articles, articleTags] = await Promise.all([getArticlesIndex(), getArticleTags()]);
	const articlePages = [
		{
			url: `${SITE.url}/manifiestos`,
			lastModified: articles[0]?.updatedAt,
			changeFrequency: 'weekly',
			priority: 0.7,
		},
		...articles.map((article) => ({
			url: `${SITE.url}/manifiestos/${article.slug}`,
			lastModified: article.updatedAt,
			changeFrequency: 'monthly',
			priority: 0.6,
		})),
		...articleTags.map((tag) => ({
			url: `${SITE.url}/manifiestos/etiqueta/${tag.slug}`,
			changeFrequency: 'weekly',
			priority: 0.4,
		})),
	];

	// Páginas de los miembros activos
	const activeMembers = await getActiveMembers();
	const aboutPages = [
		{
			url: `${SITE.url}/sobre-nosotros`,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		{
			url: `${SITE.url}/sobre-nosotros/integrantes`,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		...activeMembers.map((member) => ({
			url: `${SITE.url}/sobre-nosotros/integrantes/${member.slug}`,
			changeFrequency: 'yearly',
			priority: 0.5,
		})),
	];

	return [
		...galleryPages,
		...musicPages,
		...articlePages,
		...aboutPages,
		{
			url: 'https://daliahbanda.com',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: 'https://daliahbanda.com/galeria',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://daliahbanda.com/discografia',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7,
		},
		{
			url: 'https://daliahbanda.com/en-vivo',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
	];
}
