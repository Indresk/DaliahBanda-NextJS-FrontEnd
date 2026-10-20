import 'server-only';

import GalleryPerson from '../models/galleryPeople.model';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

class GalleryPeopleRepository {
	// Integrantes actuales primero, luego por nombre
	static async findAll({ onlyMembers = false } = {}) {
		return await GalleryPerson.findAll({
			where: onlyMembers ? { isMember: true } : {},
			order: [
				['isMember', 'DESC'],
				['name', 'ASC'],
			],
			raw: true,
		});
	}

	static async findById(id) {
		return await GalleryPerson.findByPk(id, { raw: true });
	}

	static async findBySlug(slug) {
		return await GalleryPerson.findOne({ where: { slug }, raw: true });
	}

	// Los slugs que existen de la lista dada (para validar integrantes de una imagen)
	static async findExistingSlugs(slugs) {
		const rows = await GalleryPerson.findAll({
			attributes: ['slug'],
			where: { slug: slugs },
			raw: true,
		});
		return new Set(rows.map((row) => row.slug));
	}

	static async create(fields) {
		try {
			const person = await GalleryPerson.create(fields);
			return person.toJSON();
		} catch (error) {
			if (error.original?.code === '23505') {
				throw new AppError(ERROR_CODES.GALLERY_PERSON_ALREADY_EXISTS);
			}
			throw error;
		}
	}

	static async update(id, fields) {
		const [count, rows] = await GalleryPerson.update(fields, {
			where: { id },
			returning: true,
		});
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		return await GalleryPerson.destroy({ where: { id } });
	}
}

export default GalleryPeopleRepository;
