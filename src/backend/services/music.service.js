import 'server-only';

import { MUSIC } from '../../shared/constants';
import AlbumsRepository from '../repositories/albums.reposity';
import SongsRepository from '../repositories/songs.reposity';

const strip = ({ id, albumId, songId, createdAt, updatedAt, ...rest }) => rest;

// Lecturas que cruzan álbumes y canciones
class MusicService {
	// "Otros de nuestros trabajos": el álbum más reciente y las canciones más recientes que no son
	// la obra que se está viendo (2 consultas pequeñas con límite, cacheadas en music.cache.js)
	static async findRelated({ albumId, songId }) {
		const [albums, songs] = await Promise.all([
			AlbumsRepository.findRelated({ excludeId: albumId, limit: MUSIC.RELATED_ALBUMS }),
			SongsRepository.findRelated({ excludeId: songId, limit: MUSIC.RELATED_SONGS }),
		]);

		return { albums, songs };
	}

	// Catálogo completo como datos portables para volver a sembrar (ver seeders-manual/music.js):
	// canciones, enlaces y recursos anidados; sin ids (los ids cambian entre bases de datos)
	static async exportData() {
		const albums = await AlbumsRepository.findAllForExport();

		return {
			albums: albums.map(({ links, songs, ...album }) => ({
				...strip(album),
				links: links.map(strip),
				songs: songs.map(({ links: songLinks, resources, ...song }) => ({
					...strip(song),
					links: songLinks.map(strip),
					resources: resources.map(strip),
				})),
			})),
		};
	}
}

export default MusicService;
