import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	galleryEventChangesSchema,
	galleryEventSchema,
} from '../../shared/schemas';
import GalleryEventsRepository from '../repositories/galleryEvents.reposity';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

class GalleryEventsService {
	// Dashboard: todos los eventos con su cantidad de imágenes
	static async listWithStats() {
		return await GalleryEventsRepository.listWithStats();
	}

	// Sitio público: solo eventos con imágenes activas
	static async listPublic() {
		return await GalleryEventsRepository.listWithStats({
			onlyWithActiveImages: true,
		});
	}

	static async findAll() {
		return await GalleryEventsRepository.findAll();
	}

	static async findBySlug(slug) {
		return await GalleryEventsRepository.findBySlug(slug);
	}

	static async findById(id) {
		return await GalleryEventsRepository.findById(id);
	}

	static async create(input) {
		const event = parseOrThrow(galleryEventSchema, input);
		const created = await GalleryEventsRepository.create(event);

		return successResponseWrapper(created, 'Evento creado');
	}

	static async update(id, input) {
		const changes = parseOrThrow(galleryEventChangesSchema, input);
		const updated = await GalleryEventsRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.GALLERY_EVENT_NOT_FOUND);

		return successResponseWrapper(updated, 'Evento actualizado');
	}

	// La base de datos impide borrar un evento con imágenes (GALLERY_EVENT_IN_USE)
	static async delete(id) {
		const removed = await GalleryEventsRepository.delete(id);
		if (!removed) throw new AppError(ERROR_CODES.GALLERY_EVENT_NOT_FOUND);

		return successResponseWrapper({ id }, 'Evento eliminado');
	}
}

export default GalleryEventsService;
