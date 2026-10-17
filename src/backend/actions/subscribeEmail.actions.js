'use server';

import SubscribeEmailsService from '../services/subscribeEmails.service';
import { internalRequestWrapper } from '../utils/internalRequestWrapper';

export async function subscribeEmail(email) {
	const responseData = await internalRequestWrapper(
		SubscribeEmailsService.subscribe,
		[email],
	);
	return responseData;
}

export async function unsubscribeEmail(unsubscribeToken) {
	const responseData = await internalRequestWrapper(
		SubscribeEmailsService.unsubscribe,
		[unsubscribeToken],
	);
	return responseData;
}
