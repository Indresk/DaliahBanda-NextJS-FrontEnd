import { errorHandler } from '../errors/error.handler';

export function apiWrapper(handler) {
	return async (req, context) => {
		try {
			return await handler(req, context);
		} catch (err) {
			return errorHandler(err);
		}
	};
}
