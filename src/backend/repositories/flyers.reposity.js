import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import Flyer from '../models/flyers.model';

const ORDER = [
	['displayOrder', 'ASC'],
	['id', 'ASC'],
];

class FlyersRepository {
	static async findAll({ onlyActive = false } = {}) {
		return await Flyer.findAll({
			where: onlyActive ? { active: true } : {},
			order: ORDER,
			raw: true,
		});
	}

	static async findById(id) {
		return await Flyer.findByPk(id, { raw: true });
	}

	static async create(fields) {
		try {
			const flyer = await Flyer.create(fields);
			return flyer.toJSON();
		} catch (error) {
			if (error.original?.code === '23505') {
				throw new AppError(ERROR_CODES.FLYER_ALREADY_EXISTS);
			}
			throw error;
		}
	}

	static async update(id, fields) {
		const [count, rows] = await Flyer.update(fields, { where: { id }, returning: true });
		return count ? rows[0].toJSON() : null;
	}

	static async delete(id) {
		return await Flyer.destroy({ where: { id } });
	}
}

export default FlyersRepository;
