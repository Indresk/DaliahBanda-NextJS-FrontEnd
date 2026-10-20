import { humanizeSlug } from '../buildMetadata';

export const albumsMeta = {
	title: 'Discografía',
	description:
		'Discografía de Daliah Banda: álbumes y canciones de metalcore y pop emo punk desde Bogotá.',
	path: '/albums',
	indexable: false,
};

export const albumMeta = (album) => ({
	title: `Álbum ${humanizeSlug(album)}`,
	description: `Escucha el álbum ${humanizeSlug(album)} de Daliah Banda.`,
	path: `/albums/${album}`,
	indexable: false,
});

export const songMeta = (album, song) => ({
	title: `${humanizeSlug(song)} - ${humanizeSlug(album)}`,
	description: `${humanizeSlug(song)}, canción del álbum ${humanizeSlug(album)} de Daliah Banda.`,
	path: `/albums/${album}/${song}`,
	indexable: false,
});

const songResource = (label, resource) => (album, song) => ({
	title: `${label} de ${humanizeSlug(song)}`,
	description: `${label} de ${humanizeSlug(song)}, canción de Daliah Banda.`,
	path: `/albums/${album}/${song}/${resource}`,
	indexable: false,
});

export const songLyricsMeta = songResource(
	'Letra y acordes',
	'letra-y-acordes',
);
export const songScoresMeta = songResource('Partituras', 'partituras');
export const songStemsMeta = songResource('Stems', 'stems');
