import User from '../models/users.model';

class UserRepository {
	static async findAll() {
		return await User.findAll({ raw: true });
	}

	static async findOneBy(field, value) {
		return await User.findOne({ where: { [field]: value }, raw: true });
	}

	static async create(email, role) {
		return await User.create({ email, role });
	}

	static async update(uid, field, value) {
		return await User.update({ [field]: value }, { where: { id: uid } });
	}

	static async delete(id) {
		return await User.destroy({ where: { id } });
	}
}

export default UserRepository;
