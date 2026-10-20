import 'server-only';

import { fn, col, where } from 'sequelize';
import AllowedEmails from '../models/allowedEmails.model';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

class AllowedEmailsRepository {
	static async findAll() {
		return await AllowedEmails.findAll({
			attributes: ['id', 'email', 'createdAt'],
			order: [['email', 'ASC']],
			raw: true,
		});
	}

	static async findByEmail(userEmail) {
		return await AllowedEmails.findOne({
			where: where(fn('lower', col('email')), String(userEmail).toLowerCase()),
			attributes: ['email'],
			raw: true,
		});
	}

	static async create(email) {
		try {
			const allowedEmail = await AllowedEmails.create({ email });
			return allowedEmail.toJSON();
		} catch (error) {
			if (error.original?.code === '23505') {
				throw new AppError(ERROR_CODES.ALLOWED_EMAIL_ALREADY_EXISTS);
			}

			throw error;
		}
	}

	static async delete(email) {
		return await AllowedEmails.destroy({
			where: where(fn('lower', col('email')), String(email).toLowerCase()),
		});
	}
}

export default AllowedEmailsRepository;
