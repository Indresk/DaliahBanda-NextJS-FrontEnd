import 'server-only';

import apiAuthMiddleware from '../middlewares/apiAuth.middleware';
import { errorMiddleware } from '../middlewares/error.middleware';

export function apiWrapper(handler) {
	return async (req, context) => {
		try {
			await apiAuthMiddleware(req, context);
			return await handler(req, context);
		} catch (err) {
			return errorMiddleware(err);
		}
	};
}
