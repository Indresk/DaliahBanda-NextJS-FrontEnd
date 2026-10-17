import { NextResponse } from 'next/server';
import SubscribeEmailsService from '../../../../src/backend/services/subscribeEmails.service';
import { apiWrapper } from '../../../../src/backend/utils/apiWrapper';

async function putHandler(request) {
	const { email } = await request.json();
	const subscriberData = SubscribeEmailsService.subscribe(email);

	return NextResponse.json(subscriberData, { status: 200 });
}

async function deleteHandler(request) {
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get('token');

	const subscriberData = SubscribeEmailsService.unsubscribe(token);
	return NextResponse.json(subscriberData, { status: 201 });
}

export const PUT = apiWrapper(putHandler);
export const DELETE = apiWrapper(deleteHandler);
