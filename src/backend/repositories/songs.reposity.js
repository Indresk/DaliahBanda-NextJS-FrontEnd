import 'server-only';

import { Op, literal } from 'sequelize';
import sequelize from '../config/db';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Album, Song, SongLink, SongResource } from '../models/music.model';
import { BY_DISPLAY_ORDER, baseRepository } from './baseRepository';
import { childRepository } from './childRepository';
import { PUBLIC_ALBUM_ATTRIBUTES } from './albums.reposity';

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

const errorRules = {
	unique: ERROR_CODES.SONG_ALREADY_EXISTS,
	// Distingue cuál restricción única se violó: el número de pista o el slug
	uniqueByConstraint: { songs_album_track: ERROR_CODES.SONG_TRACK_TAKEN },
};

class SongsRepository extends baseRepository(Song, errorRules) {
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


	static async findByIdWithRelations(id) {
		const song = await Song.findByPk(id, {
			include: [
				{ model: Album, as: 'album', attributes: ['id', 'slug', 'title'] },
				{ model: SongLink, as: 'links', separate: true, order: BY_DISPLAY_ORDER },
				{ model: SongResource, as: 'resources', separate: true, order: [['kind', 'ASC'], ...BY_DISPLAY_ORDER] },
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
				{ model: SongLink, as: 'links', separate: true, attributes: ['platform', 'url'], order: BY_DISPLAY_ORDER },
				{
					model: SongResource,
					as: 'resources',
					separate: true,
					attributes: ['kind', 'label', 'instrument', 'url'],
					order: [['kind', 'ASC'], ...BY_DISPLAY_ORDER],
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
				{ model: SongLink, as: 'links', separate: true, attributes: ['platform', 'url'], order: BY_DISPLAY_ORDER },
			],
			order: NEWEST_FIRST,
		});
		return song?.toJSON() ?? null;
	}

	// Todas las canciones publicadas (título y ruta): datos estructurados del grupo
	static async findAllPublic() {
		const songs = await Song.findAll({
			attributes: ['id', 'slug', 'title', 'releasedAt'],
			where: { active: true },
			include: [{ ...publicAlbumInclude, attributes: ['slug', 'title', 'releasedAt'] }],
			order: NEWEST_FIRST,
		});
		return songs.map((song) => song.toJSON());
	}

	// Otras canciones para "Otros de nuestros trabajos"
	static async findRelated({ excludeId, limit }) {
		const songs = await Song.findAll({
			attributes: ['id', 'slug', 'title', 'audioUrl', 'coverUrl', 'coverWidth', 'coverHeight'],
			where: { active: true, ...(excludeId && { id: { [Op.ne]: excludeId } }) },
			include: [publicAlbumInclude],
			order: NEWEST_FIRST,
			limit,
		});
		return songs.map((song) => song.toJSON());
	}

	// Solo una canción puede ser la destacada del inicio (índice único parcial en la base): al
	// destacar una se quita la marca a las demás en la misma transacción
	static async create(fields, options) {
		if (!fields.featured) return await super.create(fields, options);

		return await sequelize.transaction(async (transaction) => {
			await SongsRepository.unfeatureOthers(null, transaction);
			return await super.create(fields, { ...options, transaction });
		});
	}

	static async update(id, fields, options) {
		if (!fields.featured) return await super.update(id, fields, options);

		return await sequelize.transaction(async (transaction) => {
			await SongsRepository.unfeatureOthers(id, transaction);
			return await super.update(id, fields, { ...options, transaction });
		});
	}

	static async unfeatureOthers(exceptId, transaction) {
		await Song.update(
			{ featured: false },
			{
				where: { featured: true, ...(exceptId && { id: { [Op.ne]: exceptId } }) },
				transaction,
			},
		);
	}
}

export const SongLinksRepository = childRepository(SongLink, 'songId', {
	unique: ERROR_CODES.MUSIC_LINK_ALREADY_EXISTS,
});
export const SongResourcesRepository = childRepository(SongResource, 'songId');
export default SongsRepository;
