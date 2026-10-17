import 'server-only';

import SubscribeEmail from '../models/subscribeEmails.model';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

class SubscribeEmailsRepository {
	static async findAllActive() {
		return await SubscribeEmail.findAll({
			where: { isActive: true },
			attributes: ['id', 'email', 'userId', 'unsubscribeToken'],
			raw: true,
		});
	}

	static async findByEmail(email) {
		return await SubscribeEmail.findOne({ where: { email }, raw: true });
	}

	static async findByToken(unsubscribeToken) {
		return await SubscribeEmail.findOne({
			where: { unsubscribeToken },
			raw: true,
		});
	}

	static async create(email, userId = null) {
		try {
			const subscriber = await SubscribeEmail.create({ email, userId });
			return subscriber.toJSON();
		} catch (error) {
			if (error.original?.code === '23505') {
				throw new AppError(ERROR_CODES.SUBSCRIBER_ALREADY_EXISTS);
			}

			throw error;
		}
	}

	static async update(id, fields) {
		const [affectedCount, affectedRows] = await SubscribeEmail.update(fields, {
			where: { id },
			returning: true,
		});
		return [affectedCount, affectedRows];
	}

	static async linkUserByEmail(email, userId) {
		const [affectedCount] = await SubscribeEmail.update(
			{ userId },
			{ where: { email, userId: null } },
		);
		return affectedCount;
	}
}

export default SubscribeEmailsRepository;
