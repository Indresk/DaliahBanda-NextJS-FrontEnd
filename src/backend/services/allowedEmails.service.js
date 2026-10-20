import 'server-only';

import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import AllowedEmailsRepository from '../repositories/allowedEmails.reposity';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';
import { emailSchema } from '../../shared/schemas';

class AllowedEmailsService {
	static async findAll() {
		return await AllowedEmailsRepository.findAll();
	}

	// Lo usa el login de Google: un correo que no esté en la lista no puede entrar
	static async verifyEmail(userEmail) {
		if (typeof userEmail !== 'string' || !userEmail) return false;

		const found = await AllowedEmailsRepository.findByEmail(userEmail.trim());
		return Boolean(found);
	}

	static async create(rawEmail) {
		const email = parseOrThrow(emailSchema, rawEmail);
		await AllowedEmailsRepository.create(email);

		return successResponseWrapper({ email }, 'Correo añadido a la lista de acceso');
	}

	static async delete(rawEmail, requesterEmail) {
		const email = parseOrThrow(emailSchema, rawEmail);

		// Evita que un admin se deje fuera a sí mismo
		if (email === String(requesterEmail).trim().toLowerCase()) {
			throw new AppError(ERROR_CODES.CANNOT_REMOVE_OWN_EMAIL);
		}

		const removed = await AllowedEmailsRepository.delete(email);
		if (!removed) throw new AppError(ERROR_CODES.ALLOWED_EMAIL_NOT_FOUND);

		return successResponseWrapper({ email }, 'Correo quitado de la lista de acceso');
	}
}

export default AllowedEmailsService;
