import { SITE } from '../site';
import { MUSIC_GROUP_ID, albumSchemaId, songSchemaId } from './ids';

const RELEASE_TYPES = {
	album: 'AlbumRelease',
	ep: 'EPRelease',
	single: 'SingleRelease',
};

const albumUrl = (album) => `${SITE.url}/discografia/${album.slug}`;
const songUrl = (album, song) => `${albumUrl(album)}/${song.slug}`;
const sameAs = (links) => (links.length ? { sameAs: links.map((link) => link.url) } : {});

// Referencia corta a un álbum (para listas y para "inAlbum")
export const buildAlbumRef = (album) => ({
	'@type': 'MusicAlbum',
	'@id': albumSchemaId(album.slug),
	name: album.title,
	url: albumUrl(album),
	albumReleaseType: `https://schema.org/${RELEASE_TYPES[album.type]}`,
});

// Referencia corta a una canción
export const buildRecordingRef = (album, song) => ({
	'@type': 'MusicRecording',
	'@id': songSchemaId(album.slug, song.slug),
	name: song.title,
	url: songUrl(album, song),
});

// Página de un álbum o sencillo, con sus pistas (album = resultado de getAlbum)
export function buildMusicAlbumSchema(album) {
	return {
		'@context': 'https://schema.org',
		...buildAlbumRef(album),
		image: album.coverUrl,
		description: album.tagline || album.description || undefined,
		datePublished: album.releasedAt,
		inLanguage: SITE.language,
		byArtist: { '@id': MUSIC_GROUP_ID },
		numTracks: album.songs.length,
		track: album.songs.map((song) => ({
			...buildRecordingRef(album, song),
			position: song.trackNumber,
		})),
		...sameAs(album.links),
	};
}

// Página de una canción (song = resultado de getSong; `links` ya con el respaldo del álbum)
export function buildMusicRecordingSchema(song, links) {
	const { album } = song;

	return {
		'@context': 'https://schema.org',
		...buildRecordingRef(album, song),
		description: song.shortDescription,
		image: song.coverUrl ?? album.coverUrl,
		datePublished: song.releasedAt ?? album.releasedAt,
		inLanguage: SITE.language,
		byArtist: { '@id': MUSIC_GROUP_ID },
		inAlbum: buildAlbumRef(album),
		...sameAs(links),
	};
}
