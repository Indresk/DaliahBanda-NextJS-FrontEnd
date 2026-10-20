import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	memberChangesSchema,
	memberImageSchema,
	memberLinkSchema,
	memberSchema,
} from '../../shared/schemas';
import GalleryPeopleRepository from '../repositories/galleryPeople.reposity';
import MembersRepository, {
	MemberImagesRepository,
	MemberLinksRepository,
} from '../repositories/members.reposity';
import { childOperations } from '../utils/childOperations';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

async function assertMemberExists(memberId) {
	if (!(await MembersRepository.findById(memberId))) {
		throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);
	}
}

const links = childOperations({
	schema: memberLinkSchema,
	parentKey: 'memberId',
	assertParentExists: assertMemberExists,
	repository: MemberLinksRepository,
	notFound: ERROR_CODES.MEMBER_LINK_NOT_FOUND,
	label: 'Enlace',
});

const images = childOperations({
	schema: memberImageSchema,
	parentKey: 'memberId',
	assertParentExists: assertMemberExists,
	repository: MemberImagesRepository,
	notFound: ERROR_CODES.MEMBER_IMAGE_NOT_FOUND,
	label: 'Imagen',
});

class MembersService {
	static links = links;
	static images = images;

	static async findAll() {
		return await MembersRepository.findAll();
	}

	// Sitio público: solo los activos, en orden
	static async findActive() {
		return await MembersRepository.findAll({ onlyActive: true });
	}

	static async findByIdWithRelations(id) {
		return await MembersRepository.findByIdWithRelations(id);
	}

	static async create(input) {
		const member = parseOrThrow(memberSchema, input);
		const created = await MembersRepository.create(member);

		return successResponseWrapper(created, 'Miembro creado');
	}

	static async update(id, input) {
		const changes = parseOrThrow(memberChangesSchema, input);
		const updated = await MembersRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);

		return successResponseWrapper(updated, 'Miembro actualizado');
	}

	// Sus enlaces e imágenes se borran en cascada y la etiqueta de galería queda sin vínculo
	static async delete(id) {
		if (!(await MembersRepository.delete(id))) {
			throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);
		}
		return successResponseWrapper({ id }, 'Miembro eliminado');
	}

	// Datos portables para volver a sembrar (ver seeders-manual/members.js): hijos incluidos y
	// la etiqueta de galería vinculada por slug (los ids cambian entre bases de datos).
	static async exportData() {
		const [members, people] = await Promise.all([
			MembersRepository.findAllWithRelations(),
			GalleryPeopleRepository.findAll(),
		]);
		const peopleByMember = new Map(
			people.filter((person) => person.memberId).map((person) => [person.memberId, person.slug]),
		);
		const strip = ({ id, memberId, createdAt, updatedAt, ...rest }) => rest;

		return {
			members: members.map(({ links, images, ...member }) => ({
				...strip(member),
				galleryPersonSlug: peopleByMember.get(member.id) ?? null,
				links: links.map(strip),
				images: images.map(strip),
			})),
		};
	}
}

export default MembersService;
