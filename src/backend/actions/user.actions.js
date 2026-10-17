'use server';

import { USER_ROLES } from '../../shared/constants';
import UserService from '../services/user.service';
import { internalRequestWrapper } from '../utils/internalRequestWrapper';

export async function createUser(email) {
	const responseData = await internalRequestWrapper(UserService.create, [
		email,
		USER_ROLES.USER,
	]);
	return responseData;
}
