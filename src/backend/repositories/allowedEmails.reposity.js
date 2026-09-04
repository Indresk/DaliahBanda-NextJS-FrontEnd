import 'server-only';

import AllowedEmails from '../models/allowedEmails.model';

class AllowedEmailsRepository {
	static async findAll() {
		return await AllowedEmails.findAll({
			attributes: ['email'],
			raw: true,
		});
	}

	static async findByEmail(userEmail) {
		return await AllowedEmails.findOne({
			where: { email: userEmail },
			attributes: ['email'],
			raw: true,
		});
	}

	static async create(email) {
		return await AllowedEmails.create({ email });
	}

	static async delete(email) {
		return await AllowedEmails.destroy({ where: { email } });
	}
}

export default AllowedEmailsRepository;
