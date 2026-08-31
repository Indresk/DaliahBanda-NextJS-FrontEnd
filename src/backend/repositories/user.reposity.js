import User from '../models/users.model';

class UserRepository {
	static async create(email, role) {
		const createdUser = await User.create({ email, role });
		return createdUser;
	}
}

export default UserRepository;
