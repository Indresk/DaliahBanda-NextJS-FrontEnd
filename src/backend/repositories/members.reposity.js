import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { childRepository } from './childRepository';
import { Member, MemberImage, MemberLink } from '../models/members.model';

const ORDER = [
	['displayOrder', 'ASC'],
	['id', 'ASC'],
];

// Lo que pinta el sitio público en el carrusel de integrantes (sin enlaces ni imágenes)
const PUBLIC_ATTRIBUTES = [
	'id', 'slug', 'name', 'instrument', 'shortBio',
	'featuredUrl', 'featuredWidth', 'featuredHeight', 'featuredAlt',
];

class MembersRepository {
	static async findAll({ onlyActive = false } = {}) {
		return await Member.findAll({
			attributes: onlyActive ? PUBLIC_ATTRIBUTES : undefined,
			where: onlyActive ? { active: true } : {},
			order: ORDER,
			raw: true,
		});
	}

	static async findById(id) {
		return await Member.findByPk(id, { raw: true });
	}

	// Miembro con sus enlaces e imágenes, en una sola consulta con JOIN
	static async findByIdWithRelations(id) {
		const member = await Member.findByPk(id, {
			include: [
				{ model: MemberLink, as: 'links' },
				{ model: MemberImage, as: 'images' },
			],
			order: [
				[{ model: MemberLink, as: 'links' }, 'displayOrder', 'ASC'],
				[{ model: MemberLink, as: 'links' }, 'id', 'ASC'],
				[{ model: MemberImage, as: 'images' }, 'displayOrder', 'ASC'],
				[{ model: MemberImage, as: 'images' }, 'id', 'ASC'],
			],
		});
		return member?.toJSON() ?? null;
	}

	// Todos los miembros con relaciones, para exportar
	static async findAllWithRelations() {
		const members = await Member.findAll({
			include: [
				{ model: MemberLink, as: 'links' },
				{ model: MemberImage, as: 'images' },
			],
			order: [
				...ORDER,
				[{ model: MemberLink, as: 'links' }, 'displayOrder', 'ASC'],
				[{ model: MemberImage, as: 'images' }, 'displayOrder', 'ASC'],
			],
		});
		return members.map((member) => member.toJSON());
	}

	static async create(fields) {
		try {
			const member = await Member.create(fields);
			return member.toJSON();
		} catch (error) {
			if (error.original?.code === '23505') {
				throw new AppError(ERROR_CODES.MEMBER_ALREADY_EXISTS);
			}
			throw error;
		}
	}

	static async update(id, fields) {
		const [count, rows] = await Member.update(fields, { where: { id }, returning: true });
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		return await Member.destroy({ where: { id } });
	}
}

export const MemberLinksRepository = childRepository(MemberLink, 'memberId');
export const MemberImagesRepository = childRepository(MemberImage, 'memberId');
export default MembersRepository;
