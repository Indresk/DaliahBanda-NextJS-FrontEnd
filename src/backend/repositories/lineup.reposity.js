import 'server-only';

import { Member } from '../models/members.model';
import LineupEntry from '../models/lineup.model';
import { baseRepository } from './baseRepository';

const CHRONOLOGICAL = [
	['startYear', 'ASC'],
	['id', 'ASC'],
];

class LineupRepository extends baseRepository(LineupEntry) {
	// Cada entrada con los datos de su miembro (un JOIN). El nombre del miembro prevalece sobre el
	// copiado en la entrada, que solo es el respaldo de las personas sin miembro; el slug solo se
	// devuelve si el miembro está activo (tiene página pública).
	static async findAllWithMember() {
		const rows = await LineupEntry.findAll({
			include: [{ model: Member, as: 'member', attributes: ['slug', 'name', 'active'], required: false }],
			order: CHRONOLOGICAL,
		});
		return rows.map((row) => {
			const { member, ...entry } = row.toJSON();
			return {
				...entry,
				personName: member?.name ?? entry.personName,
				memberSlug: member?.active ? member.slug : null,
			};
		});
	}

	// Entradas de un miembro que siguen abiertas (sin fecha de fin)
	static async findOpenByMember(memberId, options) {
		return await LineupEntry.findAll({ ...options, where: { memberId, endYear: null }, raw: true });
	}

	// Cierra con la misma fecha todas las entradas abiertas del miembro; devuelve cuántas cerró
	static async closeOpenByMember(memberId, { endYear, endMonth }, options) {
		const [count] = await LineupEntry.update(
			{ endYear, endMonth },
			{ ...options, where: { memberId, endYear: null } },
		);
		return count;
	}

	static async findAll() {
		return await LineupEntry.findAll({ order: CHRONOLOGICAL, raw: true });
	}
}

export default LineupRepository;
