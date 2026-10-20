import 'server-only';

import { QueryTypes } from 'sequelize';
import sequelize from '../config/db';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import GalleryEvent from '../models/galleryEvents.model';

function mapDatabaseError(error) {
	const code = error.original?.code;
	if (code === '23505') return new AppError(ERROR_CODES.GALLERY_EVENT_ALREADY_EXISTS);
	// RESTRICT en Postgres lanza 23001 (restrict_violation); 23503 es foreign_key_violation
	if (code === '23001' || code === '23503') {
		return new AppError(ERROR_CODES.GALLERY_EVENT_IN_USE);
	}
	return error;
}

class GalleryEventsRepository {
	static async findAll() {
		return await GalleryEvent.findAll({
			order: [
				['eventDate', 'DESC NULLS LAST'],
				['id', 'DESC'],
			],
			raw: true,
		});
	}

	static async findById(id) {
		return await GalleryEvent.findByPk(id, { raw: true });
	}

	static async findBySlug(slug) {
		return await GalleryEvent.findOne({ where: { slug }, raw: true });
	}

	// Eventos con su cantidad de imágenes y una portada, en una sola consulta.
	// La portada es la elegida (coverUrl) si sigue activa; si no, la imagen activa más reciente.
	static async listWithStats({ onlyWithActiveImages = false } = {}) {
		return await sequelize.query(
			`SELECT e.id, e.slug, e.title, e.description, e."eventDate", e."isFeatured", e."coverUrl",
			        COALESCE(s.total, 0)::int AS "totalImages",
			        COALESCE(s.active, 0)::int AS "activeImages",
			        c.url AS "cover.url", c.alt AS "cover.alt",
			        c.width AS "cover.width", c.height AS "cover.height"
			   FROM "gallery-events" e
			   LEFT JOIN (
			        SELECT "eventId", COUNT(*) AS total, COUNT(*) FILTER (WHERE active) AS active
			          FROM "gallery-images" GROUP BY "eventId") s ON s."eventId" = e.id
			   LEFT JOIN LATERAL (
			        SELECT url, alt, width, height FROM "gallery-images" i
			         WHERE i."eventId" = e.id AND i.active
			         ORDER BY (i.url = e."coverUrl") DESC, i."takenAt" DESC, i.id DESC
			         LIMIT 1) c ON true
			  ${onlyWithActiveImages ? 'WHERE COALESCE(s.active, 0) > 0' : ''}
			  ORDER BY e."isFeatured" DESC, e."eventDate" DESC NULLS LAST, e.id DESC`,
			{ type: QueryTypes.SELECT, nest: true },
		);
	}

	static async create(fields) {
		try {
			const event = await GalleryEvent.create(fields);
			return event.toJSON();
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	static async update(id, fields) {
		try {
			const [count, rows] = await GalleryEvent.update(fields, {
				where: { id },
				returning: true,
			});
			return count ? rows[0].toJSON() : null;
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}

	// La clave foránea es RESTRICT: si el evento tiene imágenes la base de datos lo impide
	static async delete(id) {
		try {
			return await GalleryEvent.destroy({ where: { id } });
		} catch (error) {
			throw mapDatabaseError(error);
		}
	}
}

export default GalleryEventsRepository;
