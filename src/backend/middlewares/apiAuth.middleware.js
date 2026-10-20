import 'server-only';

import { NextResponse } from 'next/server';
import config from '../config/index';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';

export default async function apiAuthMiddleware(request, event) {
	// Los webhooks no pasan por apiWrapper: verifican su propia firma (kickWebhook.middleware.js)
	const apiKey = config.API_KEY;
	if (!apiKey) {
		throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR);
	}

	const authHeader = request.headers.get('authorization');
	if (!authHeader) {
		throw new AppError(ERROR_CODES.MISSING_AUTH_HEADER);
	}

	const [scheme, token] = authHeader.split(' ');
	if (scheme !== 'Bearer' || !token) {
		throw new AppError(ERROR_CODES.INVALID_AUTH_HEADER);
	}

	if (token !== apiKey) {
		throw new AppError(ERROR_CODES.FORBIDDEN);
	}

	return NextResponse.next();
}
