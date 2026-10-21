import 'server-only';

import { Op, literal } from 'sequelize';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Album, AlbumLink, Song, SongLink, SongResource } from '../models/music.model';
import { BY_DISPLAY_ORDER, baseRepository } from './baseRepository';
import { childRepository } from './childRepository';

const NEWEST_FIRST = [
	['releasedAt', 'DESC'],
	['id', 'DESC'],
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

class AlbumsRepository extends baseRepository(Album, {
	unique: ERROR_CODES.ALBUM_ALREADY_EXISTS,
	// Un álbum con canciones no se elimina (ON DELETE RESTRICT)
	foreignKey: ERROR_CODES.ALBUM_IN_USE,
}) {
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


	static async findByIdWithLinks(id) {
		const album = await Album.findByPk(id, {
			include: [{ model: AlbumLink, as: 'links', separate: true, order: BY_DISPLAY_ORDER }],
		});
		return album?.toJSON() ?? null;
	}

	static async findPublicLinks(albumId) {
		return await AlbumLink.findAll({
			attributes: ['platform', 'url'],
			where: { albumId },
			order: BY_DISPLAY_ORDER,
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
					order: BY_DISPLAY_ORDER,
				},
			],
		});
		return album?.toJSON() ?? null;
	}

	// Otros álbumes activos para "Otros de nuestros trabajos"
	static async findRelated({ excludeId, limit }) {
		return await Album.findAll({
			attributes: PUBLIC_ALBUM_ATTRIBUTES,
			where: { active: true, ...(excludeId && { id: { [Op.ne]: excludeId } }) },
			order: NEWEST_FIRST,
			limit,
			raw: true,
		});
	}

	// Todo el catálogo con sus canciones, enlaces y recursos (para exportar). Cada nivel va en una
	// consulta aparte: un solo JOIN multiplicaría las filas (enlaces × canciones × recursos).
	static async findAllForExport() {
		const albums = await Album.findAll({
			include: [
				{ model: AlbumLink, as: 'links', separate: true, order: BY_DISPLAY_ORDER },
				{
					model: Song,
					as: 'songs',
					separate: true,
					order: [
						['trackNumber', 'ASC'],
						['id', 'ASC'],
					],
					include: [
						{ model: SongLink, as: 'links', separate: true, order: BY_DISPLAY_ORDER },
						{ model: SongResource, as: 'resources', separate: true, order: BY_DISPLAY_ORDER },
					],
				},
			],
			order: NEWEST_FIRST,
		});
		return albums.map((album) => album.toJSON());
	}
}

export const AlbumLinksRepository = childRepository(AlbumLink, 'albumId', {
	unique: ERROR_CODES.MUSIC_LINK_ALREADY_EXISTS,
});
export default AlbumsRepository;
