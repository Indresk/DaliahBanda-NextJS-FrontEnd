import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	memberChangesSchema,
	memberDeparture,
	memberImageSchema,
	memberLinkSchema,
	memberSchema,
} from '../../shared/schemas';
import GalleryPeopleRepository from '../repositories/galleryPeople.reposity';
import LineupRepository from '../repositories/lineup.reposity';
import MembersRepository, {
	MemberImagesRepository,
	MemberLinksRepository,
} from '../repositories/members.reposity';
import { toExportRow } from '../utils/exportRow';
import { withTransaction } from '../utils/transaction';
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

	static async findPublicBySlug(slug) {
		return await MembersRepository.findPublicBySlug(slug);
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

	// Baja de un miembro en un solo paso: lo despublica, cierra con la fecha de salida sus entradas
	// abiertas de la formación y quita la marca de integrante actual de su etiqueta de galería (las
	// fotos conservan la etiqueta). Todo o nada.
	static async deactivate(id, input) {
		const { endYear, endMonth } = parseOrThrow(memberDeparture, input);
		const departure = endYear * 12 + ((endMonth ?? 12) - 1);

		return await withTransaction(async (transaction) => {
			const options = { transaction };
			const member = await MembersRepository.findById(id);
			if (!member) throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);

			const open = await LineupRepository.findOpenByMember(id, options);
			if (
				open.some(
					(entry) =>
						departure < entry.startYear * 12 + ((entry.startMonth ?? 1) - 1),
				)
			) {
				throw new AppError(
					ERROR_CODES.BAD_REQUEST,
					'La fecha de salida es anterior al inicio de una de sus entradas en la formación.',
				);
			}

			await MembersRepository.update(id, { active: false }, options);
			const closedEntries = await LineupRepository.closeOpenByMember(
				id,
				{ endYear, endMonth },
				options,
			);
			const tagsUpdated = await GalleryPeopleRepository.clearIsMemberByMemberId(
				id,
				options,
			);

			return successResponseWrapper(
				{ id, closedEntries, tagsUpdated },
				`${member.name} dado de baja. Entradas de la formación cerradas: ${closedEntries}`,
			);
		});
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
			people
				.filter((person) => person.memberId)
				.map((person) => [person.memberId, person.slug]),
		);

		return {
			members: members.map(({ links, images, ...member }) => ({
				...toExportRow(member),
				galleryPersonSlug: peopleByMember.get(member.id) ?? null,
				links: links.map(toExportRow),
				images: images.map(toExportRow),
			})),
		};
	}
}

export default MembersService;
