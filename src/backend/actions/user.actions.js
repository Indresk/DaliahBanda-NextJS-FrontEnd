'use server';

import { USER_ROLES } from '../../shared/constants';
import UserService from '../services/user.service';
import { internalRequestWrapper } from '../utils/internalRequestWrapper';

export async function createUser(email, role = USER_ROLES.USER) {
	const responseData = await internalRequestWrapper(UserService.create, [
		email,
		role,
	]);
	return responseData;
}
