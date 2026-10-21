import 'server-only';

import { MUSIC } from '../../shared/constants';
import { createTaggedCache } from '../utils/taggedCache';
import AlbumsService from './albums.service';
import MusicService from './music.service';
import SongsService from './songs.service';

// Lecturas públicas de la música (listado, álbum, canción, destacada y relacionadas). Las acciones
// del dashboard las invalidan con invalidateMusic().
const cache = createTaggedCache({ tag: MUSIC.CACHE_TAG, revalidate: MUSIC.CACHE_FALLBACK_SECONDS });

export const getAlbums = cache.wrap(
	async () => AlbumsService.listPublic(),
	['music-albums'],
);

// Álbum con sus pistas y enlaces (null si no existe o no está activo)
export const getAlbum = cache.wrap(
	async (slug) => AlbumsService.findPublicBySlug(slug),
	['music-album'],
);

// Canción con su álbum, enlaces y recursos (null si ella o su álbum no están activos)
export const getSong = cache.wrap(
	async (albumSlug, songSlug) => SongsService.findPublic(albumSlug, songSlug),
	['music-song'],
);

// Canciones publicadas (título + álbum): datos estructurados del grupo
export const getSongs = cache.wrap(
	async () => SongsService.listPublic(),
	['music-songs'],
);

export const getFeaturedSong = cache.wrap(
	async () => SongsService.findFeatured(),
	['music-featured'],
);

export const getRelatedWorks = cache.wrap(
	async (albumId, songId) => MusicService.findRelated({ albumId, songId }),
	['music-related'],
);

export const invalidateMusic = cache.invalidate;
