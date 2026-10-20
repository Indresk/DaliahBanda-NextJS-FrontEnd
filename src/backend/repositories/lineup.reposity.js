import 'server-only';

import { Member } from '../models/members.model';
import LineupEntry from '../models/lineup.model';

const CHRONOLOGICAL = [
	['startYear', 'ASC'],
	['id', 'ASC'],
];

class LineupRepository {
	// Cada entrada con el slug de su miembro activo (null si no tiene página pública), en un JOIN
	static async findAllWithMember() {
		const rows = await LineupEntry.findAll({
			include: [{ model: Member, as: 'member', attributes: ['slug', 'active'], required: false }],
			order: CHRONOLOGICAL,
		});
		return rows.map((row) => {
			const { member, ...entry } = row.toJSON();
			return { ...entry, memberSlug: member?.active ? member.slug : null };
		});
	}

	static async findAll() {
		return await LineupEntry.findAll({ order: CHRONOLOGICAL, raw: true });
	}

	static async create(fields) {
		const entry = await LineupEntry.create(fields);
		return entry.toJSON();
	}

	static async update(id, fields) {
		const [count, rows] = await LineupEntry.update(fields, { where: { id }, returning: true });
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		return await LineupEntry.destroy({ where: { id } });
	}
}

export default LineupRepository;
