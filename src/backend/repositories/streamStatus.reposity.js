import 'server-only';

import sequelize from '../config/db';
import StreamStatus from '../models/streamStatus.model';

const ROW_ID = 1;

class StreamStatusRepository {
	static async get() {
		return await StreamStatus.findByPk(ROW_ID, { raw: true });
	}

	static async applyEvent({ eventId, eventAt, ...status }) {
		return await sequelize.transaction(async (transaction) => {
			const current = await StreamStatus.findByPk(ROW_ID, {
				transaction,
				lock: transaction.LOCK.UPDATE,
			});

			if (current?.lastEventId === eventId) return 'duplicate';
			if (current?.lastEventAt && eventAt < current.lastEventAt) return 'stale';

			await StreamStatus.upsert(
				{ id: ROW_ID, ...status, lastEventId: eventId, lastEventAt: eventAt },
				{ transaction },
			);
			return 'applied';
		});
	}
}

export default StreamStatusRepository;
