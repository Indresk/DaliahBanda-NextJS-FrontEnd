import 'server-only';

import { Op, QueryTypes, literal } from 'sequelize';
import sequelize from '../config/db';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { GALLERY_MEMBER_MODES } from '../../shared/constants';
import GalleryImage from '../models/galleryImages.model';
import GalleryEvent from '../models/galleryEvents.model';

// Solo lo que pinta la galería pública (sin ids internos ni estado)
const PUBLIC_ATTRIBUTES = ['id', 'url', 'alt', 'width', 'height', 'takenAt'];
const ADMIN_ATTRIBUTES = [
	...PUBLIC_ATTRIBUTES,
	'category',
	'eventId',
	'memberSlugs',
	'active',
	'createdAt',
	'updatedAt',
];

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

// Traduce los errores de Postgres a errores de la aplicación
function mapDatabaseError(error) {
	const code = error.original?.code;
	if (code === '23505') return new AppError(ERROR_CODES.GALLERY_IMAGE_ALREADY_EXISTS);
	if (code === '23503') return new AppError(ERROR_CODES.GALLERY_EVENT_NOT_FOUND);
	return error;
}

// Acceso a datos de gallery-images. Recibe filtros ya validados (ver galleryFiltersSchema).
class GalleryImagesRepository {
	static buildWhere(filters, cursor) {
		const conditions = [];

		if (filters.category) conditions.push({ category: filters.category });
		if (filters.eventId) conditions.push({ eventId: filters.eventId });
		if (filters.active !== undefined) conditions.push({ active: filters.active });
		if (filters.withoutAlt) conditions.push({ alt: '' });
		if (filters.search) {
			conditions.push({ alt: { [Op.iLike]: `%${escapeLike(filters.search)}%` } });
		}
		if (filters.takenFrom) conditions.push({ takenAt: { [Op.gte]: filters.takenFrom } });
		if (filters.takenTo) conditions.push({ takenAt: { [Op.lte]: filters.takenTo } });

		// @> (aparecen todos) y && (aparece alguno) usan el índice GIN de memberSlugs
		if (filters.memberSlugs?.length) {
			const operator = filters.memberMatch === 'any' ? Op.overlap : Op.contains;
			conditions.push({ memberSlugs: { [operator]: filters.memberSlugs } });
		}

		// Cursor por comparación de filas: recorre el índice (takenAt DESC, id DESC) sin
		// ordenar ni saltar filas, así la página 50 cuesta lo mismo que la primera.
		// Las columnas llevan el nombre de la tabla: con el JOIN a gallery-events del listado
		// del dashboard, "id" solo sería ambiguo.
		if (cursor) {
			conditions.push(
				literal(
					`("gallery-images"."takenAt", "gallery-images"."id") < (${sequelize.escape(cursor.takenAt)}, ${Number(cursor.id)})`,
				),
			);
		}

		return conditions.length ? { [Op.and]: conditions } : {};
	}

	// Pide limit + 1 filas para saber si hay otra página sin hacer un COUNT
	static async findPage({ filters, cursor, limit, admin = false }) {
		return await GalleryImage.findAll({
			attributes: admin ? ADMIN_ATTRIBUTES : PUBLIC_ATTRIBUTES,
			where: GalleryImagesRepository.buildWhere(filters, cursor),
			order: [
				['takenAt', 'DESC'],
				['id', 'DESC'],
			],
			limit: limit + 1,
			include: admin
				? [{ model: GalleryEvent, as: 'event', attributes: ['id', 'slug', 'title'] }]
				: [],
			raw: true,
			nest: true,
		});
	}

	static async findById(id) {
		return await GalleryImage.findByPk(id, { raw: true });
	}

	static async findByUrl(url) {
		return await GalleryImage.findOne({ where: { url }, raw: true });
	}

	static async findByIds(ids) {
		return await GalleryImage.findAll({ where: { id: ids }, raw: true });
	}

	static async findExistingUrls(urls) {
		const rows = await GalleryImage.findAll({
			attributes: ['url'],
			where: { url: urls },
			raw: true,
		});
		return new Set(rows.map((row) => row.url));
	}

	// Cuántas imágenes hay por categoría, evento e integrante (para filtros y estadísticas)
	static async getFacets({ active } = {}) {
		const where = active === undefined ? '' : 'WHERE active = :active';
		const rows = await sequelize.query(
			`SELECT 'category' AS kind, category::text AS key, COUNT(*)::int AS total
			   FROM "gallery-images" ${where} GROUP BY category
			 UNION ALL
			 SELECT 'event', "eventId"::text, COUNT(*)::int
			   FROM "gallery-images" ${where} GROUP BY "eventId"
			 UNION ALL
			 SELECT 'member', member, COUNT(*)::int
			   FROM "gallery-images", unnest("memberSlugs") AS member ${where}
			  GROUP BY member`,
			{ type: QueryTypes.SELECT, replacements: { active } },
		);

		const byKind = (kind) =>
			Object.fromEntries(rows.filter((row) => row.kind === kind).map((row) => [row.key, row.total]));
		return { categories: byKind('category'), events: byKind('event'), members: byKind('member') };
	}

	static async countByEvent(eventId) {
		return await GalleryImage.count({ where: { eventId } });
	}

	static async countByMember(slug) {
		return await GalleryImage.count({ where: { memberSlugs: { [Op.contains]: [slug] } } });
	}

	static async create(fields) {
		try {
			const image = await GalleryImage.create(fields);
			return image.toJSON();
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	static async createMany(rows) {
		try {
			const created = await GalleryImage.bulkCreate(rows, { returning: ['id', 'url'] });
			return created.map((image) => image.toJSON());
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	static async update(id, fields) {
		try {
			const [count, rows] = await GalleryImage.update(fields, {
				where: { id },
				returning: true,
			});
			return count ? rows[0].toJSON() : null;
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	// Un solo UPDATE para todos los ids. Devuelve cuántas filas cambió.
	static async updateMany(ids, fields) {
		try {
			const [count] = await GalleryImage.update(fields, { where: { id: ids } });
			return count;
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	// Publicar solo las que tienen alt (regla de accesibilidad); devuelve cuántas se publicaron
	static async activateWithAlt(ids) {
		const [, count] = await sequelize.query(
			`UPDATE "gallery-images" SET active = true, "updatedAt" = NOW()
			  WHERE id = ANY($1::int[]) AND alt <> ''`,
			{ bind: [ids], type: QueryTypes.UPDATE },
		);
		return count;
	}

	// Cambia los integrantes de varias imágenes en una sentencia (add | remove | set)
	static async updateMembers(ids, mode, slugs) {
		const expressions = {
			[GALLERY_MEMBER_MODES.SET]: '$2::text[]',
			// Conserva el orden actual y agrega solo los que faltan
			[GALLERY_MEMBER_MODES.ADD]: `"memberSlugs" || ARRAY(
				SELECT s FROM unnest($2::text[]) AS s WHERE s <> ALL("memberSlugs"))`,
			[GALLERY_MEMBER_MODES.REMOVE]: `ARRAY(
				SELECT s FROM unnest("memberSlugs") AS s WHERE s <> ALL($2::text[]))`,
		};

		const [, count] = await sequelize.query(
			`UPDATE "gallery-images" SET "memberSlugs" = ${expressions[mode]}, "updatedAt" = NOW()
			  WHERE id = ANY($1::int[])`,
			{ bind: [ids, slugs], type: QueryTypes.UPDATE },
		);
		return count;
	}

	// Borra y devuelve lo borrado ({ id, url }) para poder limpiar los archivos del bucket
	static async deleteMany(ids) {
		return await sequelize.query(
			'DELETE FROM "gallery-images" WHERE id = ANY($1::int[]) RETURNING id, url',
			{ bind: [ids], type: QueryTypes.SELECT },
		);
	}
}

export default GalleryImagesRepository;
