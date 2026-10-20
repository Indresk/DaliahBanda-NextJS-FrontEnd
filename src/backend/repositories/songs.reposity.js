import 'server-only';

import { Op, literal } from 'sequelize';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Album, Song, SongLink, SongResource } from '../models/music.model';
import { childRepository } from './childRepository';
import { PUBLIC_ALBUM_ATTRIBUTES } from './albums.reposity';

const BY_ORDER = [
	['displayOrder', 'ASC'],
	['id', 'ASC'],
];

// Del álbum solo lo necesario para armar rutas, portada de respaldo y la fecha
const ALBUM_SUMMARY = ['id', 'slug', 'title', 'type', 'coverUrl', 'coverWidth', 'coverHeight', 'releasedAt'];

const PUBLIC_SONG_ATTRIBUTES = [
	'id', 'slug', 'title', 'trackNumber', 'releasedAt', 'shortDescription', 'longDescription',
	'themes', 'story', 'acknowledgments', 'audioUrl', 'coverUrl', 'coverWidth', 'coverHeight',
];

// La canción solo es pública si ella y su álbum están activos
const publicAlbumInclude = {
	model: Album,
	as: 'album',
	required: true,
	where: { active: true },
	attributes: ALBUM_SUMMARY,
};

const NEWEST_FIRST = [
	literal('COALESCE("songs"."releasedAt", "album"."releasedAt") DESC'),
	['id', 'DESC'],
];

function mapDatabaseError(error) {
	if (error.original?.code === '23505') return new AppError(ERROR_CODES.SONG_ALREADY_EXISTS);
	return error;
}

class SongsRepository {
	static async findByAlbum(albumId) {
		return await Song.findAll({
			where: { albumId },
			order: [
				['trackNumber', 'ASC'],
				['id', 'ASC'],
			],
			raw: true,
		});
	}

	static async findById(id) {
		return await Song.findByPk(id, { raw: true });
	}

	static async findByIdWithRelations(id) {
		const song = await Song.findByPk(id, {
			include: [
				{ model: Album, as: 'album', attributes: ['id', 'slug', 'title'] },
				{ model: SongLink, as: 'links', separate: true, order: BY_ORDER },
				{ model: SongResource, as: 'resources', separate: true, order: [['kind', 'ASC'], ...BY_ORDER] },
			],
		});
		return song?.toJSON() ?? null;
	}

	// Página de una canción: ella, su álbum, enlaces y recursos (la canción y el álbum en un
	// JOIN; enlaces y recursos aparte). Devuelve null si la canción o el álbum no están activos.
	static async findPublic(albumSlug, songSlug) {
		const song = await Song.findOne({
			attributes: PUBLIC_SONG_ATTRIBUTES,
			where: { slug: songSlug, active: true },
			include: [
				{ ...publicAlbumInclude, where: { active: true, slug: albumSlug }, attributes: PUBLIC_ALBUM_ATTRIBUTES },
				{ model: SongLink, as: 'links', separate: true, attributes: ['platform', 'url'], order: BY_ORDER },
				{
					model: SongResource,
					as: 'resources',
					separate: true,
					attributes: ['kind', 'label', 'instrument', 'url'],
					order: [['kind', 'ASC'], ...BY_ORDER],
				},
			],
		});
		return song?.toJSON() ?? null;
	}

	// Canción recomendada del inicio: la destacada más reciente
	static async findFeatured() {
		const song = await Song.findOne({
			attributes: PUBLIC_SONG_ATTRIBUTES,
			where: { active: true, featured: true },
			include: [
				{ ...publicAlbumInclude, attributes: PUBLIC_ALBUM_ATTRIBUTES },
				{ model: SongLink, as: 'links', separate: true, attributes: ['platform', 'url'], order: BY_ORDER },
			],
			order: NEWEST_FIRST,
		});
		return song?.toJSON() ?? null;
	}

	// Otras canciones para "Otros de nuestros trabajos"
	static async findRelated({ excludeId, limit }) {
		const songs = await Song.findAll({
			attributes: ['id', 'slug', 'title', 'audioUrl', 'coverUrl', 'coverWidth', 'coverHeight'],
			where: { active: true, id: { [Op.ne]: excludeId } },
			include: [publicAlbumInclude],
			order: NEWEST_FIRST,
			limit,
		});
		return songs.map((song) => song.toJSON());
	}

	static async create(fields) {
		try {
			const song = await Song.create(fields);
			return song.toJSON();
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	static async update(id, fields) {
		const [count, rows] = await Song.update(fields, { where: { id }, returning: true });
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		return await Song.destroy({ where: { id } });
	}
}

export const SongLinksRepository = childRepository(SongLink, 'songId', {
	duplicateError: ERROR_CODES.MUSIC_LINK_ALREADY_EXISTS,
});
export const SongResourcesRepository = childRepository(SongResource, 'songId');
export default SongsRepository;
