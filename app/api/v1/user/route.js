import { NextResponse } from 'next/server';
import { apiWrapper } from '../../../../src/backend/utils/apiWrapper';
import UserService from '../../../../src/backend/services/user.service';

async function postHandler(request) {
	const { email, role } = await request.json();

	const createdUser = await UserService.create(email, role);
	return NextResponse.json({ createdUser }, { status: 200 });
}

export const POST = apiWrapper(postHandler);
