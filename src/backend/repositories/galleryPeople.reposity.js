import 'server-only';

import GalleryPerson from '../models/galleryPeople.model';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { baseRepository } from './baseRepository';

class GalleryPeopleRepository extends baseRepository(GalleryPerson, {
	unique: ERROR_CODES.GALLERY_PERSON_ALREADY_EXISTS,
	// Un miembro de la banda solo puede estar vinculado a una etiqueta
	uniqueByConstraint: { memberId: ERROR_CODES.GALLERY_PERSON_MEMBER_TAKEN },
}) {
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

	static async findBySlug(slug) {
		return await GalleryPerson.findOne({ where: { slug }, raw: true });
	}

	static async findByMemberId(memberId) {
		return await GalleryPerson.findOne({ where: { memberId }, raw: true });
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
}

export default GalleryPeopleRepository;
