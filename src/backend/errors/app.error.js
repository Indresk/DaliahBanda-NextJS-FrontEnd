import { ERROR_CODES } from '../../shared/errors/error.codes.js';
import { errorsDictionary } from '../../shared/errors/error.dictionary.js';

export default class AppError extends Error {
	constructor(code, message = null, details = null) {
		const resolvedCode = code ? code : ERROR_CODES.INTERNAL_SERVER_ERROR;

		const errorDefinition = errorsDictionary[resolvedCode];

		super(message ?? errorDefinition.message);

		this.code = resolvedCode;
		this.statusCode = errorDefinition.statusCode;
		this.details = details;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}
}
