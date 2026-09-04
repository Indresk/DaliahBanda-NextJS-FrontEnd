import 'server-only';

import { errorMiddleware } from '../middlewares/error.middleware';

export async function internalRequestWrapper(service, args = []) {
	try {
		return await service(...args);
	} catch (err) {
		return errorMiddleware(err, true);
	}
}
