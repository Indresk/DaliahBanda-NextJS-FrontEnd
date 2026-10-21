import 'server-only';

import { ERROR_CODES } from '../../shared/errors/error.codes';
import Flyer from '../models/flyers.model';
import { BY_DISPLAY_ORDER, baseRepository } from './baseRepository';

class FlyersRepository extends baseRepository(Flyer, { unique: ERROR_CODES.FLYER_ALREADY_EXISTS }) {
	static async findAll({ onlyActive = false } = {}) {
		return await Flyer.findAll({
			where: onlyActive ? { active: true } : {},
			order: BY_DISPLAY_ORDER,
			raw: true,
		});
	}
}

export default FlyersRepository;
