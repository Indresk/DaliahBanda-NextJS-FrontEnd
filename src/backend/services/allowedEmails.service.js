import 'server-only';

import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import AllowedEmailsRepository from '../repositories/allowedEmails.reposity';

class AllowedEmailsService {
	static async findAll() {}
	static async verifyEmail(userEmail) {
		if (!userEmail) {
			console.log(new AppError(ERROR_CODES.BAD_REQUEST));
			return false;
		}

		const userFinded = await AllowedEmailsRepository.findByEmail(userEmail);

		if (userEmail === userFinded.email) return true;
		return false;
	}
	static async create(email) {}
	static async delete(email) {}
}
export default AllowedEmailsService;
