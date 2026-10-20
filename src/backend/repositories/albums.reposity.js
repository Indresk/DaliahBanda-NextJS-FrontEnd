import 'server-only';

import { Op, literal } from 'sequelize';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Album, AlbumLink, Song, SongLink, SongResource } from '../models/music.model';
import { childRepository } from './childRepository';

const NEWEST_FIRST = [
	['releasedAt', 'DESC'],
	['id', 'DESC'],
];
const BY_ORDER = [
	['displayOrder', 'ASC'],
	['id', 'ASC'],
];

// Lo que pintan las tarjetas y la barra lateral del álbum en el sitio público
export const PUBLIC_ALBUM_ATTRIBUTES = [
	'id', 'slug', 'title', 'type', 'tagline', 'description',
	'coverUrl', 'coverWidth', 'coverHeight', 'releasedAt',
];

// Lo que pinta la lista de pistas: incluye los tipos de recurso que tiene cada canción
// (para mostrar solo los accesos Stems/Partituras/Letra que existen) sin consultas extra
export const PUBLIC_TRACK_ATTRIBUTES = [
	'id', 'slug', 'title', 'trackNumber', 'releasedAt', 'shortDescription', 'audioUrl',
	'coverUrl', 'coverWidth', 'coverHeight',
	[
		literal(
			`(SELECT COALESCE(ARRAY_AGG(DISTINCT r."kind"::text), '{}') FROM "song-resources" r WHERE r."songId" = "songs"."id")`,
		),
		'resourceKinds',
	],
];

function mapDatabaseError(error) {
	const code = error.original?.code;
	if (code === '23505') return new AppError(ERROR_CODES.ALBUM_ALREADY_EXISTS);
	// RESTRICT en Postgres lanza 23001 (restrict_violation); 23503 es foreign_key_violation
	if (code === '23001' || code === '23503') return new AppError(ERROR_CODES.ALBUM_IN_USE);
	return error;
}

class AlbumsRepository {
	// Dashboard: todos los álbumes con su cantidad de canciones
	static async findAllWithStats() {
		return await Album.findAll({
			attributes: {
				include: [
					[
						literal('(SELECT COUNT(*) FROM "songs" s WHERE s."albumId" = "albums"."id")::int'),
						'songCount',
					],
				],
			},
			order: NEWEST_FIRST,
			raw: true,
		});
	}

	static async findById(id) {
		return await Album.findByPk(id, { raw: true });
	}

	static async findByIdWithLinks(id) {
		const album = await Album.findByPk(id, {
			include: [{ model: AlbumLink, as: 'links', separate: true, order: BY_ORDER }],
		});
		return album?.toJSON() ?? null;
	}

	static async findPublicLinks(albumId) {
		return await AlbumLink.findAll({
			attributes: ['platform', 'url'],
			where: { albumId },
			order: BY_ORDER,
			raw: true,
		});
	}

	// Sitio público: álbumes y sencillos activos, del más reciente al más antiguo
	static async findPublicList() {
		return await Album.findAll({
			attributes: [
				...PUBLIC_ALBUM_ATTRIBUTES,
				[
					literal(
						'(SELECT COUNT(*) FROM "songs" s WHERE s."albumId" = "albums"."id" AND s."active")::int',
					),
					'songCount',
				],
			],
			where: { active: true },
			order: NEWEST_FIRST,
			raw: true,
		});
	}

	// Álbum activo con sus pistas activas y sus enlaces: 3 consultas (las hijas van aparte
	// para no multiplicar filas), cacheadas por music.cache.js
	static async findPublicBySlug(slug) {
		const album = await Album.findOne({
			attributes: PUBLIC_ALBUM_ATTRIBUTES,
			where: { slug, active: true },
			include: [
				{
					model: Song,
					as: 'songs',
					separate: true,
					where: { active: true },
					attributes: PUBLIC_TRACK_ATTRIBUTES,
					order: [
						['trackNumber', 'ASC'],
						['id', 'ASC'],
					],
				},
				{
					model: AlbumLink,
					as: 'links',
					separate: true,
					attributes: ['platform', 'url'],
					order: BY_ORDER,
				},
			],
		});
		return album?.toJSON() ?? null;
	}

	// Otros álbumes activos para "Otros de nuestros trabajos"
	static async findRelated({ excludeId, limit }) {
		return await Album.findAll({
			attributes: PUBLIC_ALBUM_ATTRIBUTES,
			where: { active: true, id: { [Op.ne]: excludeId } },
			order: NEWEST_FIRST,
			limit,
			raw: true,
		});
	}

	// Todo el catálogo con sus canciones, enlaces y recursos (para exportar)
	static async findAllForExport() {
		const albums = await Album.findAll({
			include: [
				{ model: AlbumLink, as: 'links' },
				{
					model: Song,
					as: 'songs',
					include: [
						{ model: SongLink, as: 'links' },
						{ model: SongResource, as: 'resources' },
					],
				},
			],
			order: [
				...NEWEST_FIRST,
				[{ model: AlbumLink, as: 'links' }, 'displayOrder', 'ASC'],
				[{ model: Song, as: 'songs' }, 'trackNumber', 'ASC'],
				[{ model: Song, as: 'songs' }, { model: SongLink, as: 'links' }, 'displayOrder', 'ASC'],
				[{ model: Song, as: 'songs' }, { model: SongResource, as: 'resources' }, 'displayOrder', 'ASC'],
			],
		});
		return albums.map((album) => album.toJSON());
	}

	static async create(fields) {
		try {
			const album = await Album.create(fields);
			return album.toJSON();
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	static async update(id, fields) {
		const [count, rows] = await Album.update(fields, { where: { id }, returning: true });
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		try {
			return await Album.destroy({ where: { id } });
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}
}

export const AlbumLinksRepository = childRepository(AlbumLink, 'albumId', {
	duplicateError: ERROR_CODES.MUSIC_LINK_ALREADY_EXISTS,
});
export default AlbumsRepository;
