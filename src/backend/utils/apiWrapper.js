import { errorMiddleware } from '../middlewares/error.middleware';

export function apiWrapper(handler) {
	return async (req, context) => {
		try {
			return await handler(req, context);
		} catch (err) {
			return errorMiddleware(err);
		}
	};
}
