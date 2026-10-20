import 'server-only';

import sequelize from '../config/db';
import KickCredentials from '../models/kickCredentials.model';

const ROW_ID = 1;

class KickCredentialsRepository {
	static async get() {
		return await KickCredentials.findByPk(ROW_ID, { raw: true });
	}

	static async save(fields, options = {}) {
		await KickCredentials.upsert({ id: ROW_ID, ...fields }, options);
	}

	static async withLock(work) {
		return await sequelize.transaction(async (transaction) => {
			const row = await KickCredentials.findByPk(ROW_ID, {
				transaction,
				lock: transaction.LOCK.UPDATE,
				raw: true,
			});
			return await work(row, transaction);
		});
	}

	static async clear() {
		return await KickCredentials.destroy({ where: { id: ROW_ID } });
	}
}

export default KickCredentialsRepository;
