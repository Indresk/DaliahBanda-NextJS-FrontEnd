import AllowedEmails from '../models/allowedEmails.model';

class AllowedEmailsRepository {
	static async findAll() {
		return await AllowedEmails.findAll();
	}

	static async create(email) {
		return await AllowedEmails.create({ email });
	}

	static async delete(email) {
		return await AllowedEmails.destroy({ where: { email } });
	}
}

export default AllowedEmailsRepository;
