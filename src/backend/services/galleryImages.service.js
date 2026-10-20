import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { GALLERY } from '../../shared/constants';
import {
	galleryBatchSchema,
	galleryBulkChangesSchema,
	galleryFiltersSchema,
	galleryIdsSchema,
	galleryImageChangesSchema,
	galleryImageSchema,
} from '../../shared/schemas';
import GalleryEventsRepository from '../repositories/galleryEvents.reposity';
import GalleryImagesRepository from '../repositories/galleryImages.reposity';
import GalleryPeopleRepository from '../repositories/galleryPeople.reposity';
import { decodeCursor, encodeCursor } from '../utils/cursor';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';
import AssetsService from './assets.service';

const isEmpty = (value) =>
	value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);

// Quita los filtros vacíos (los formularios los envían como "")
const compact = (filters = {}) =>
	Object.fromEntries(Object.entries(filters).filter(([, value]) => !isEmpty(value)));

// Campos editables de una imagen guardada, para validarla de nuevo después de un cambio
const pickEditable = ({ url, alt, category, eventId, memberSlugs, width, height, takenAt, active }) => ({
	url, alt, category, eventId, memberSlugs, width, height, takenAt, active,
});

async function assertEventExists(eventId) {
	if (!(await GalleryEventsRepository.findById(eventId))) {
		throw new AppError(ERROR_CODES.GALLERY_EVENT_NOT_FOUND);
	}
}

// Los integrantes se guardan como slugs en un arreglo (sin clave foránea): se validan aquí
async function assertPeopleExist(slugs) {
	if (!slugs?.length) return;

	const existing = await GalleryPeopleRepository.findExistingSlugs(slugs);
	const unknown = slugs.filter((slug) => !existing.has(slug));
	if (unknown.length) {
		throw new AppError(
			ERROR_CODES.GALLERY_UNKNOWN_PEOPLE,
			`Integrantes que no existen: ${unknown.join(', ')}.`,
		);
	}
}

class GalleryImagesService {
	// Página de imágenes filtrada. Con `admin: false` solo devuelve imágenes activas y los
	// campos públicos. Devuelve { items, nextCursor } (nextCursor es null en la última página).
	static async list(rawFilters, { admin = false } = {}) {
		const { cursor, limit: requestedLimit, ...filters } = parseOrThrow(
			galleryFiltersSchema,
			compact(rawFilters),
		);
		const limit =
			requestedLimit ?? (admin ? GALLERY.ADMIN_PAGE_SIZE : GALLERY.PUBLIC_PAGE_SIZE);

		const rows = await GalleryImagesRepository.findPage({
			filters: admin ? filters : { ...filters, active: true, withoutAlt: undefined },
			cursor: cursor ? decodeCursor(cursor) : undefined,
			limit,
			admin,
		});

		const items = rows.slice(0, limit);
		const last = items.at(-1);

		return {
			items,
			nextCursor: rows.length > limit ? encodeCursor(last) : null,
		};
	}

	static async findById(id) {
		return await GalleryImagesRepository.findById(id);
	}

	static async findByUrl(url) {
		return await GalleryImagesRepository.findByUrl(url);
	}

	static async getFacets(options) {
		return await GalleryImagesRepository.getFacets(options);
	}

	static async create(input) {
		const image = parseOrThrow(galleryImageSchema, input);
		await assertEventExists(image.eventId);
		await assertPeopleExist(image.memberSlugs);

		const created = await GalleryImagesRepository.create(image);
		return successResponseWrapper(created, 'Imagen añadida a la galería');
	}

	// Registra en lote imágenes ya subidas al bucket, con los mismos datos compartidos.
	// Las URLs que ya están en la galería se omiten. Sin alt quedan inactivas.
	static async createMany(input) {
		const { shared, items } = parseOrThrow(galleryBatchSchema, input);
		await assertEventExists(shared.eventId);
		await assertPeopleExist(shared.memberSlugs);

		const existing = await GalleryImagesRepository.findExistingUrls(items.map((item) => item.url));
		const fresh = items.filter((item) => !existing.has(item.url));

		const rows = fresh.map((item) =>
			parseOrThrow(galleryImageSchema, { ...shared, ...item }),
		);
		const created = rows.length ? await GalleryImagesRepository.createMany(rows) : [];

		return successResponseWrapper(
			{ created: created.length, skipped: existing.size, ids: created.map((row) => row.id) },
			`${created.length} imágenes añadidas`,
		);
	}

	// Cambios de una imagen: se combinan con lo guardado y se valida el resultado completo
	// (por ejemplo, no se puede activar una imagen sin alt)
	static async update(id, input) {
		const changes = parseOrThrow(galleryImageChangesSchema, input);
		const current = await GalleryImagesRepository.findById(id);
		if (!current) throw new AppError(ERROR_CODES.GALLERY_IMAGE_NOT_FOUND);

		const next = parseOrThrow(galleryImageSchema, { ...pickEditable(current), ...changes });
		if (changes.eventId) await assertEventExists(changes.eventId);
		if (changes.memberSlugs) await assertPeopleExist(changes.memberSlugs);

		const { url, ...fields } = next;
		const updated = await GalleryImagesRepository.update(id, fields);
		return successResponseWrapper(updated, 'Imagen actualizada');
	}

	// Cambios masivos sobre varias imágenes, cada uno en una sola sentencia SQL
	static async bulkUpdate(rawIds, rawChanges) {
		const ids = parseOrThrow(galleryIdsSchema, rawIds);
		const { active, members, ...fields } = parseOrThrow(galleryBulkChangesSchema, rawChanges);
		if (fields.eventId) await assertEventExists(fields.eventId);
		if (members) await assertPeopleExist(members.slugs);

		const summary = { selected: ids.length, published: 0, skippedWithoutAlt: 0 };

		if (Object.keys(fields).length) {
			await GalleryImagesRepository.updateMany(ids, fields);
		}
		if (members) {
			await GalleryImagesRepository.updateMembers(ids, members.mode, members.slugs);
		}
		if (active === true) {
			summary.published = await GalleryImagesRepository.activateWithAlt(ids);
			summary.skippedWithoutAlt = ids.length - summary.published;
		} else if (active === false) {
			await GalleryImagesRepository.updateMany(ids, { active: false });
		}

		const message =
			summary.skippedWithoutAlt > 0
				? `Cambios aplicados. ${summary.skippedWithoutAlt} imágenes sin alt no se publicaron.`
				: 'Cambios aplicados';
		return successResponseWrapper(summary, message);
	}

	// Elimina de la galería. Con alsoDeleteFiles también borra los archivos del bucket
	// (solo los que están en nuestro bucket; los de otros sitios se ignoran).
	static async remove(rawIds, { alsoDeleteFiles = false } = {}) {
		const ids = parseOrThrow(galleryIdsSchema, rawIds);
		const deleted = await GalleryImagesRepository.deleteMany(ids);

		const files = { deleted: 0, failed: [] };
		if (alsoDeleteFiles) {
			for (const { url } of deleted) {
				try {
					if (await AssetsService.removeByPublicUrl(url)) files.deleted += 1;
				} catch {
					files.failed.push(url);
				}
			}
		}

		return successResponseWrapper(
			{ deleted: deleted.length, files },
			files.failed.length
				? `Imágenes eliminadas. No se pudieron borrar ${files.failed.length} archivos del bucket.`
				: 'Imágenes eliminadas',
		);
	}
}

export default GalleryImagesService;
