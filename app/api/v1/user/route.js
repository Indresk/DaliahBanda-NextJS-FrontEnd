import { NextResponse } from 'next/server';
import { apiWrapper } from '../../../../src/backend/utils/apiWrapper';
import UserService from '../../../../src/backend/services/user.service';

async function getHandler(request) {
	// Configurar para si tenemos query params realizar la busqueda acorde al filtro, si no buscar todos || VA EN SERVICIO
	// const searchParams = request.nextUrl.searchParams;
	// const query = searchParams.get('query');
	const usersData = await UserService.findAll();
	return NextResponse.json(usersData, { status: 200 });
}

async function postHandler(request) {
	const { email, role } = await request.json();

	const createdUser = await UserService.create(email, role);
	return NextResponse.json(createdUser, { status: 201 });
}

export const GET = apiWrapper(getHandler);
export const POST = apiWrapper(postHandler);
