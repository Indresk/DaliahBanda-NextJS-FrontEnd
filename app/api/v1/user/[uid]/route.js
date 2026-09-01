import { NextResponse } from 'next/server';
import UserService from '../../../../../src/backend/services/user.service';
import { apiWrapper } from '../../../../../src/backend/utils/apiWrapper';
import { USER_QUERY_FIELDS } from '../../../../../src/shared/constants';

async function getHandler(request, context) {
	const { uid } = await context.params;
	const usersData = await UserService.findOneBy(USER_QUERY_FIELDS.UUID, uid);
	return NextResponse.json(usersData, { status: 200 });
}

async function patchHandler(request, context) {
	const { field, value } = await request.json();
	const { uid } = await context.params;

	const updatedUser = await UserService.update(uid, field, value);
	return NextResponse.json(updatedUser, { status: 200 });
}

async function deleteHandler(request, context) {
	const { uid } = await context.params;

	const deletedUser = await UserService.delete(uid);
	return NextResponse.json(deletedUser, { status: 204 });
}

export const GET = apiWrapper(getHandler);
export const PATCH = apiWrapper(patchHandler);
export const DELETE = apiWrapper(deleteHandler);
