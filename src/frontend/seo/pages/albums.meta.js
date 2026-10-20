import { ALBUM_TYPE_LABELS } from '@/shared/constants';

export const albumsMeta = {
	title: 'Discografía',
	description:
		'Discografía de Daliah Banda: álbumes y canciones de metalcore y pop emo punk desde Bogotá.',
	path: '/albums',
};

// Primera frase útil para la descripción de una página (máx. 160 caracteres)
const summarize = (text, fallback) => {
	const value = (text || fallback).replace(/\s+/g, ' ').trim();
	return value.length > 160 ? `${value.slice(0, 157)}...` : value;
};

export const albumMeta = (album) => ({
	title: `${album.title} (${ALBUM_TYPE_LABELS[album.type]})`,
	description: summarize(
		album.tagline || album.description,
		`Escucha ${album.title} de Daliah Banda.`,
	),
	path: `/albums/${album.slug}`,
});

export const songMeta = (album, song) => ({
	title: `${song.title} - ${album.title}`,
	description: summarize(song.shortDescription, `${song.title}, canción de Daliah Banda.`),
	path: `/albums/${album.slug}/${song.slug}`,
});

// Recursos de una canción (stems, partituras, letra y acordes)
export const songResourceMeta = (album, song, route, label) => ({
	title: `${label} de ${song.title}`,
	description: `${label} de ${song.title}, canción de Daliah Banda.`,
	path: `/albums/${album.slug}/${song.slug}/${route}`,
});
