import 'server-only';

import AllowedEmails from '../models/allowedEmails.model';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

class AllowedEmailsRepository {
	static async findAll() {
		return await AllowedEmails.findAll({
			attributes: ['email'],
			raw: true,
		});
	}

	static async findByEmail(userEmail) {
		return await AllowedEmails.findOne({
			where: { email: userEmail },
			attributes: ['email'],
			raw: true,
		});
	}

	static async create(email) {
		try {
			const allowedEmail = await AllowedEmails.create({ email });
			return allowedEmail;
		} catch (error) {
			if (error.original.code === '23505') {
				throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);
			}

			throw error;
		}
	}

	static async delete(email) {
		return await AllowedEmails.destroy({ where: { email } });
	}
}

export default AllowedEmailsRepository;
