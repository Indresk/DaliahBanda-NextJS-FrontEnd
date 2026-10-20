import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	galleryPersonChangesSchema,
	galleryPersonSchema,
} from '../../shared/schemas';
import GalleryImagesRepository from '../repositories/galleryImages.reposity';
import GalleryPeopleRepository from '../repositories/galleryPeople.reposity';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

// Personas que aparecen en las fotos (integrantes actuales y anteriores)
class GalleryPeopleService {
	static async findAll() {
		return await GalleryPeopleRepository.findAll();
	}

	// Solo los integrantes actuales: son los filtros públicos de la galería
	static async findMembers() {
		return await GalleryPeopleRepository.findAll({ onlyMembers: true });
	}

	static async findBySlug(slug) {
		return await GalleryPeopleRepository.findBySlug(slug);
	}

	static async create(input) {
		const person = parseOrThrow(galleryPersonSchema, input);
		const created = await GalleryPeopleRepository.create(person);

		return successResponseWrapper(created, 'Integrante creado');
	}

	static async update(id, input) {
		const changes = parseOrThrow(galleryPersonChangesSchema, input);
		const updated = await GalleryPeopleRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.GALLERY_PERSON_NOT_FOUND);

		return successResponseWrapper(updated, 'Integrante actualizado');
	}

	static async delete(id) {
		const person = await GalleryPeopleRepository.findById(id);
		if (!person) throw new AppError(ERROR_CODES.GALLERY_PERSON_NOT_FOUND);

		// El slug está dentro de los arreglos de las imágenes (sin clave foránea): se comprueba aquí
		if (await GalleryImagesRepository.countByMember(person.slug)) {
			throw new AppError(ERROR_CODES.GALLERY_PERSON_IN_USE);
		}

		await GalleryPeopleRepository.delete(id);
		return successResponseWrapper({ id }, 'Integrante eliminado');
	}
}

export default GalleryPeopleService;
