import 'server-only';

import { QueryTypes } from 'sequelize';
import sequelize from '../config/db';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import GalleryEvent from '../models/galleryEvents.model';
import { baseRepository } from './baseRepository';

class GalleryEventsRepository extends baseRepository(GalleryEvent, {
	unique: ERROR_CODES.GALLERY_EVENT_ALREADY_EXISTS,
	// Un evento con imágenes no se elimina (ON DELETE RESTRICT)
	foreignKey: ERROR_CODES.GALLERY_EVENT_IN_USE,
}) {
	static async findAll() {
		return await GalleryEvent.findAll({
			order: [
				['eventDate', 'DESC NULLS LAST'],
				['id', 'DESC'],
			],
			raw: true,
		});
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



}

export default GalleryEventsRepository;
