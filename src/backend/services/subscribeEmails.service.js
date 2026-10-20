import 'server-only';

import { USER_QUERY_FIELDS } from '../../shared/constants';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import SubscribeEmailsRepository from '../repositories/subscribeEmails.reposity';
import UserRepository from '../repositories/user.reposity';
import successResponseWrapper from '@/back/utils/successResponseWrapper';
import { parseOrThrow } from '@/back/utils/validate';
import { emailSchema, uuidSchema } from '@/shared/schemas';

class SubscribeEmailsService {
	// Todos los suscriptores (activos y dados de baja), para el dashboard
	static async findAll() {
		return await SubscribeEmailsRepository.findAll();
	}

	static async findAllActive() {
		return await SubscribeEmailsRepository.findAllActive();
	}

	static async subscribe(rawEmail) {
		const email = parseOrThrow(emailSchema, rawEmail);

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
		parseOrThrow(uuidSchema, unsubscribeToken, {
			code: ERROR_CODES.SUBSCRIBER_NOT_FOUND,
		});

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

		const email = parseOrThrow(emailSchema, rawEmail);
		return await SubscribeEmailsRepository.linkUserByEmail(email, userId);
	}
}

export default SubscribeEmailsService;
