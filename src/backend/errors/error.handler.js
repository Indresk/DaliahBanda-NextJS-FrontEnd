import { NextResponse } from 'next/server';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { ENVIRONMENT } from '../../shared/constants';
import config from '../config/index';

export function errorHandler(err) {
	const statusCode = err.statusCode || 500;
	const errorCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;

	const response = {
		status: 'error',
		error: errorCode,
		message: err.message,
	};

	if (config.NODE_ENV != ENVIRONMENT.PROD && err.details)
		response.details = err.details;

	const { message: loggerMessage, ...loggerData } = response;

	if (statusCode >= 500) {
		console.error(loggerMessage, {
			metadata: { statusCode, stack: err.stack, ...loggerData },
		});
	} else {
		console.warn(loggerMessage, {
			metadata: { statusCode, ...loggerData },
		});
	}

	return NextResponse.json(response, { status: statusCode });
}
