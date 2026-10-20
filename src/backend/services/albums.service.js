import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	albumChangesSchema,
	albumLinkSchema,
	albumSchema,
} from '../../shared/schemas';
import AlbumsRepository, { AlbumLinksRepository } from '../repositories/albums.reposity';
import { childOperations } from '../utils/childOperations';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

async function assertAlbumExists(albumId) {
	if (!(await AlbumsRepository.findById(albumId))) {
		throw new AppError(ERROR_CODES.ALBUM_NOT_FOUND);
	}
}

// Álbumes y sencillos (un sencillo es un álbum de una sola canción)
class AlbumsService {
	static links = childOperations({
		schema: albumLinkSchema,
		parentKey: 'albumId',
		assertParentExists: assertAlbumExists,
		repository: AlbumLinksRepository,
		notFound: ERROR_CODES.MUSIC_LINK_NOT_FOUND,
		label: 'Enlace',
	});

	// Dashboard
	static async findAll() {
		return await AlbumsRepository.findAllWithStats();
	}

	static async findByIdWithLinks(id) {
		return await AlbumsRepository.findByIdWithLinks(id);
	}

	// Sitio público (solo activos)
	static async listPublic() {
		return await AlbumsRepository.findPublicList();
	}

	static async findPublicBySlug(slug) {
		return await AlbumsRepository.findPublicBySlug(slug);
	}

	static async create(input) {
		const album = parseOrThrow(albumSchema, input);
		const created = await AlbumsRepository.create(album);

		return successResponseWrapper(created, 'Álbum creado');
	}

	static async update(id, input) {
		const changes = parseOrThrow(albumChangesSchema, input);
		const updated = await AlbumsRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.ALBUM_NOT_FOUND);

		return successResponseWrapper(updated, 'Álbum actualizado');
	}

	// Un álbum con canciones no se elimina (RESTRICT en la base): sus enlaces sí caen en cascada
	static async delete(id) {
		if (!(await AlbumsRepository.delete(id))) {
			throw new AppError(ERROR_CODES.ALBUM_NOT_FOUND);
		}
		return successResponseWrapper({ id }, 'Álbum eliminado');
	}
}

export default AlbumsService;
