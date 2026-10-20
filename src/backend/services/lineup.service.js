import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { lineupEntrySchema } from '../../shared/schemas';
import LineupRepository from '../repositories/lineup.reposity';
import MembersRepository from '../repositories/members.reposity';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

// Si la entrada es de un miembro, el nombre se toma de él cuando no se escribe uno
async function resolveEntry(input) {
	const entry = parseOrThrow(lineupEntrySchema, input);
	let personName = entry.personName;

	if (entry.memberId) {
		const member = await MembersRepository.findById(entry.memberId);
		if (!member) throw new AppError(ERROR_CODES.MEMBER_NOT_FOUND);
		personName ??= member.name;
	}
	if (!personName) throw new AppError(ERROR_CODES.BAD_REQUEST, 'El nombre es obligatorio.');

	return { ...entry, personName };
}

class LineupService {
	// Dashboard
	static async findAll() {
		return await LineupRepository.findAll();
	}

	// Sitio público: en orden cronológico, con el slug del miembro si tiene página
	static async findTimeline() {
		return await LineupRepository.findAllWithMember();
	}

	static async create(input) {
		const created = await LineupRepository.create(await resolveEntry(input));

		return successResponseWrapper(created, 'Entrada añadida');
	}

	static async update(id, input) {
		const updated = await LineupRepository.update(id, await resolveEntry(input));
		if (!updated) throw new AppError(ERROR_CODES.LINEUP_ENTRY_NOT_FOUND);

		return successResponseWrapper(updated, 'Entrada actualizada');
	}

	static async delete(id) {
		if (!(await LineupRepository.delete(id))) {
			throw new AppError(ERROR_CODES.LINEUP_ENTRY_NOT_FOUND);
		}
		return successResponseWrapper({ id }, 'Entrada eliminada');
	}

	// Datos portables para volver a sembrar (ver seeders-manual/lineup.js): el miembro por slug
	static async exportData() {
		const [entries, members] = await Promise.all([
			LineupRepository.findAll(),
			MembersRepository.findAll(),
		]);
		const slugs = new Map(members.map((member) => [member.id, member.slug]));

		return {
			entries: entries.map(({ memberId, personName, role, startYear, endYear, note }) => ({
				memberSlug: slugs.get(memberId) ?? null,
				personName,
				role,
				startYear,
				endYear,
				note,
			})),
		};
	}
}

export default LineupService;
