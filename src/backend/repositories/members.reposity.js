import 'server-only';

import { literal } from 'sequelize';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { Member, MemberImage, MemberLink } from '../models/members.model';
import { BY_DISPLAY_ORDER, baseRepository } from './baseRepository';
import { childRepository } from './childRepository';

// Lo que pinta el sitio público en el carrusel de integrantes (sin enlaces ni imágenes)
const PUBLIC_ATTRIBUTES = [
	'id',
	'slug',
	'name',
	'instrument',
	'shortBio',
	'featuredUrl',
	'featuredWidth',
	'featuredHeight',
	'featuredAlt',
];

// Año de su entrada más antigua en la formación: "en la banda desde". La fecha de ingreso vive
// solo en lineup-entries, no se repite en el miembro.
const MEMBER_SINCE = [
	literal(
		'(SELECT MIN(l."startYear") FROM "lineup-entries" l WHERE l."memberId" = "members"."id")',
	),
	'memberSince',
];

// Enlaces e imágenes de apoyo van en consultas aparte (`separate`): un JOIN de ambos multiplicaría
// las filas (enlaces × imágenes)
const relations = (linkAttributes, imageAttributes) => [
	{
		model: MemberLink,
		as: 'links',
		separate: true,
		attributes: linkAttributes,
		order: BY_DISPLAY_ORDER,
	},
	{
		model: MemberImage,
		as: 'images',
		separate: true,
		attributes: imageAttributes,
		order: BY_DISPLAY_ORDER,
	},
];

class MembersRepository extends baseRepository(Member, {
	unique: ERROR_CODES.MEMBER_ALREADY_EXISTS,
}) {
	static async findAll({ onlyActive = false } = {}) {
		return await Member.findAll({
			attributes: onlyActive ? PUBLIC_ATTRIBUTES : undefined,
			where: onlyActive ? { active: true } : {},
			order: BY_DISPLAY_ORDER,
			raw: true,
		});
	}

	// Página personal: miembro activo con enlaces e imágenes de apoyo (3 consultas), cacheadas
	// por members.cache.js
	static async findPublicBySlug(slug) {
		const member = await Member.findOne({
			attributes: [...PUBLIC_ATTRIBUTES, 'longBio', MEMBER_SINCE],
			where: { slug, active: true },
			include: relations(
				['kind', 'label', 'url'],
				['id', 'url', 'alt', 'width', 'height'],
			),
		});
		return member?.toJSON() ?? null;
	}

	// Dashboard: miembro con todos sus enlaces e imágenes
	static async findByIdWithRelations(id) {
		const member = await Member.findByPk(id, {
			include: relations(undefined, undefined),
		});
		return member?.toJSON() ?? null;
	}

	// Todos los miembros con relaciones, para exportar
	static async findAllWithRelations() {
		const members = await Member.findAll({
			include: relations(undefined, undefined),
			order: BY_DISPLAY_ORDER,
		});
		return members.map((member) => member.toJSON());
	}
}

export const MemberLinksRepository = childRepository(MemberLink, 'memberId');
export const MemberImagesRepository = childRepository(MemberImage, 'memberId');
export default MembersRepository;
