import 'server-only';

import { USER_QUERY_FIELDS } from '../../shared/constants';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import SubscribeEmailsRepository from '../repositories/subscribeEmails.reposity';
import UserRepository from '../repositories/user.reposity';
import successResponseWrapper from '@/back/utils/successResponseWrapper';
import { emailSchema } from '@/shared/utils/zodSchemas';

function normalizeEmail(email) {
	if (typeof email !== 'string') throw new AppError(ERROR_CODES.BAD_REQUEST);

	const emailValidated = emailSchema.safeParse(email);
	if (!emailValidated.success) {
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'El correo no es válido.');
	}

	return emailValidated.data;
}

class SubscribeEmailsService {
	static async findAllActive() {
		return await SubscribeEmailsRepository.findAllActive();
	}

	static async subscribe(rawEmail) {
		const email = normalizeEmail(rawEmail);

		const existing = await SubscribeEmailsRepository.findByEmail(email);

		if (existing) {
			if (!existing.isActive) {
				await SubscribeEmailsRepository.update(existing.id, {
					isActive: true,
					unsubscribedAt: null,
				});
			}
			return successResponseWrapper(
				{ email },
				'¡Correo registrado exitosamente!',
			);
		}

		const user = await UserRepository.findOneBy(USER_QUERY_FIELDS.EMAIL, email);

		try {
			await SubscribeEmailsRepository.create(email, user?.id ?? null);
		} catch (error) {
			if (error.code !== ERROR_CODES.SUBSCRIBER_ALREADY_EXISTS) throw error;
		}

		return successResponseWrapper(
			{ email },
			'¡Correo registrado exitosamente!',
		);
	}

	static async unsubscribe(unsubscribeToken) {
		if (!z.uuid().safeParse(unsubscribeToken).success) {
			throw new AppError(ERROR_CODES.SUBSCRIBER_NOT_FOUND);
		}

		const subscriber =
			await SubscribeEmailsRepository.findByToken(unsubscribeToken);
		if (!subscriber) throw new AppError(ERROR_CODES.SUBSCRIBER_NOT_FOUND);

		if (subscriber.isActive) {
			await SubscribeEmailsRepository.update(subscriber.id, {
				isActive: false,
				unsubscribedAt: new Date(),
			});
		}

		return successResponseWrapper(
			{ email: subscriber.email },
			'Te has dado de baja de la lista de difusión.',
		);
	}

	static async linkUser(rawEmail, userId) {
		if (!rawEmail || !userId) throw new AppError(ERROR_CODES.BAD_REQUEST);

		const email = normalizeEmail(rawEmail);
		return await SubscribeEmailsRepository.linkUserByEmail(email, userId);
	}
}

export default SubscribeEmailsService;
