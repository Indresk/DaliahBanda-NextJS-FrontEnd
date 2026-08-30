import { NextResponse } from 'next/server';
import { apiWrapper } from '../../src/backend/utils/apiWrapper';
import { ApiError } from 'next/dist/server/api-utils';
import { ERROR_CODES } from '../../src/shared/errors/error.codes';
import AppError from '../../src/backend/errors/app.error';

const objetoRespuesta = { a: 'adwwad', b: 'dawawd' };

async function getHandler(request) {
	throw new AppError(ERROR_CODES.ROUTE_NOT_FOUND);
	// return NextResponse.json(objetoRespuesta, { status: 200 });
}

export const GET = apiWrapper(getHandler);
