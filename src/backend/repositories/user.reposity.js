import 'server-only';

import User from '../models/users.model';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '@/shared/errors/error.codes';

class UserRepository {
	static async findAll() {
		return await User.findAll({ raw: true });
	}

	static async findOneBy(field, value) {
		return await User.findOne({ where: { [field]: value }, raw: true });
	}

	static async create(email, role) {
		try {
			const user = await User.create({ email, role });
			return user;
		} catch (error) {
			if (error.original.code === '23505') {
				// const detail = error.detail || '';

				// if (detail.includes('email')) {
				throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);
				// }
			}

			throw error;
		}
	}

	static async update(uid, field, value) {
		const [affectedCount, affectedRows] = await User.update(
			{ [field]: value },
			{ where: { id: uid }, returning: true },
		);
		return [affectedCount, affectedRows];
	}

	static async delete(id) {
		return await User.destroy({ where: { id } });
	}
}

export default UserRepository;
