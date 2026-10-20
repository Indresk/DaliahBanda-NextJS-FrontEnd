import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	songChangesSchema,
	songLinkSchema,
	songResourceSchema,
	songSchema,
} from '../../shared/schemas';
import AlbumsRepository from '../repositories/albums.reposity';
import SongsRepository, {
	SongLinksRepository,
	SongResourcesRepository,
} from '../repositories/songs.reposity';
import { childOperations } from '../utils/childOperations';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

async function assertSongExists(songId) {
	if (!(await SongsRepository.findById(songId))) {
		throw new AppError(ERROR_CODES.SONG_NOT_FOUND);
	}
}

class SongsService {
	static links = childOperations({
		schema: songLinkSchema,
		parentKey: 'songId',
		assertParentExists: assertSongExists,
		repository: SongLinksRepository,
		notFound: ERROR_CODES.MUSIC_LINK_NOT_FOUND,
		label: 'Enlace',
	});

	static resources = childOperations({
		schema: songResourceSchema,
		parentKey: 'songId',
		assertParentExists: assertSongExists,
		repository: SongResourcesRepository,
		notFound: ERROR_CODES.SONG_RESOURCE_NOT_FOUND,
		label: 'Recurso',
	});

	// Dashboard
	static async findByAlbum(albumId) {
		return await SongsRepository.findByAlbum(albumId);
	}

	static async findByIdWithRelations(id) {
		return await SongsRepository.findByIdWithRelations(id);
	}

	// Sitio público (solo si la canción y su álbum están activos)
	static async findPublic(albumSlug, songSlug) {
		return await SongsRepository.findPublic(albumSlug, songSlug);
	}

	// Con enlaces de escucha: los suyos o, si no tiene, los de su álbum
	static async findFeatured() {
		const song = await SongsRepository.findFeatured();
		if (song && !song.links.length) {
			song.links = await AlbumsRepository.findPublicLinks(song.album.id);
		}
		return song;
	}

	static async create(input) {
		const song = parseOrThrow(songSchema, input);
		if (!(await AlbumsRepository.findById(song.albumId))) {
			throw new AppError(ERROR_CODES.ALBUM_NOT_FOUND);
		}
		const created = await SongsRepository.create(song);

		return successResponseWrapper(created, 'Canción creada');
	}

	static async update(id, input) {
		const changes = parseOrThrow(songChangesSchema, input);
		const updated = await SongsRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.SONG_NOT_FOUND);

		return successResponseWrapper(updated, 'Canción actualizada');
	}

	// Sus enlaces y recursos caen en cascada
	static async delete(id) {
		if (!(await SongsRepository.delete(id))) {
			throw new AppError(ERROR_CODES.SONG_NOT_FOUND);
		}
		return successResponseWrapper({ id }, 'Canción eliminada');
	}
}

export default SongsService;
