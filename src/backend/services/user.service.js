import { ERROR_CODES } from '../../shared/errors/error.codes';
import AppError from '../errors/app.error';
import UserRepository from '../repositories/user.reposity';

class UserService {
	static async create(email, role) {
		if (!email || !role) throw new AppError(ERROR_CODES.BAD_REQUEST);

		const createdUser = await UserRepository.create(email, role);
		return createdUser;
	}
}

export default UserService;
