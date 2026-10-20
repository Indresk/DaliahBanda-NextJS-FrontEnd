import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { MUSIC } from '../../shared/constants';
import AlbumsService from './albums.service';
import MusicService from './music.service';
import SongsService from './songs.service';

// Lecturas públicas de la música (listado, álbum, canción, destacada y relacionadas). Cada
// combinación de argumentos se guarda por separado. Las acciones del dashboard invalidan la
// etiqueta con invalidateMusic(); `revalidate` es el respaldo.
const options = { tags: [MUSIC.CACHE_TAG], revalidate: MUSIC.CACHE_FALLBACK_SECONDS };

export const getAlbums = unstable_cache(
	async () => AlbumsService.listPublic(),
	['music-albums'],
	options,
);

// Álbum con sus pistas y enlaces (null si no existe o no está activo)
export const getAlbum = unstable_cache(
	async (slug) => AlbumsService.findPublicBySlug(slug),
	['music-album'],
	options,
);

// Canción con su álbum, enlaces y recursos (null si ella o su álbum no están activos)
export const getSong = unstable_cache(
	async (albumSlug, songSlug) => SongsService.findPublic(albumSlug, songSlug),
	['music-song'],
	options,
);

export const getFeaturedSong = unstable_cache(
	async () => SongsService.findFeatured(),
	['music-featured'],
	options,
);

export const getRelatedWorks = unstable_cache(
	async (albumId, songId) => MusicService.findRelated({ albumId, songId }),
	['music-related'],
	options,
);

export function invalidateMusic() {
	revalidateTag(MUSIC.CACHE_TAG, { expire: 0 });
}
