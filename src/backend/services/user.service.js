import {
	USER_QUERY_FIELDS,
	USER_ROLES,
	USER_UPDATABLE_FIELDS,
} from '../../shared/constants';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import UserRepository from '../repositories/user.reposity';

class UserService {
	static async findAll() {
		const users = await UserRepository.findAll();
		return users;
	}

	static async findOneBy(field, value) {
		if (!field || !value) throw new AppError(ERROR_CODES.BAD_REQUEST);

		if (!Object.values(USER_QUERY_FIELDS).includes(field))
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El campo de busqueda solicitado no existe.`,
			);

		return await UserRepository.findOneBy(field, value);
	}

	static async create(email, role) {
		if (!email || !role) throw new AppError(ERROR_CODES.BAD_REQUEST);

		const createdUser = await UserRepository.create(email, role);
		return createdUser;
	}

	static async update(uid, field, value) {
		if (!uid || !field || !value) throw new AppError(ERROR_CODES.BAD_REQUEST);

		const uidNumber = parseInt(uid);
		if (isNaN(uidNumber) || uidNumber <= 0) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND, `ID provisto no valido.`);
		}

		if (!Object.values(USER_UPDATABLE_FIELDS).includes(field)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`Campo para actualizar ${field} no permitido.`,
			);
		}

		if (
			field === USER_UPDATABLE_FIELDS.ROLE &&
			!Object.values(USER_ROLES).includes(value)
		) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`Valor para actualizar: ${value} no permitido.`,
			);
		}

		const [affectedCount, affectedRows] = await UserRepository.update(
			uid,
			field,
			value,
		);

		if (affectedCount <= 0) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND);
		}

		return affectedRows[0];
	}

	static async delete(uid) {
		if (!uid) throw new AppError(ERROR_CODES.BAD_REQUEST);

		const userDeletedData = await UserRepository.delete(uid);
		return userDeletedData;
	}
}

export default UserService;
