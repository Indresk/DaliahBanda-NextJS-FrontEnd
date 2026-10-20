import 'server-only';

import { redirect } from 'next/navigation';
import { auth } from '../config/auth';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { DASHBOARD_ROLES, USER_QUERY_FIELDS } from '../../shared/constants';
import UserRepository from '../repositories/user.reposity';

// Usuario de la sesión con su rol leído de la base de datos. El rol del token (JWT)
// se copia al iniciar sesión y no cambia hasta que expira, así que no se usa para decidir.
async function getSessionUser() {
	const session = await auth();
	const email = session?.user?.email;
	if (!email) return null;

	const user = await UserRepository.findOneBy(USER_QUERY_FIELDS.EMAIL, email);
	return user ? { id: user.id, email: user.email, role: user.role } : null;
}

// Para acciones del servidor y rutas API: lanza AppError si no hay permiso
export async function requireRole(allowedRoles) {
	const user = await getSessionUser();
	if (!user) throw new AppError(ERROR_CODES.UNAUTHORIZED);
	if (!allowedRoles.includes(user.role)) {
		throw new AppError(ERROR_CODES.INSUFFICIENT_PERMISSIONS);
	}
	return user;
}

// Para páginas: redirige en vez de lanzar error. Quien no tiene rol de dashboard va al
// inicio (no a /dashboard, que lo devolvería aquí en bucle); quien sí lo tiene, al resumen.
export async function requirePageRole(allowedRoles) {
	const user = await getSessionUser();
	if (!user) redirect('/login');
	if (!allowedRoles.includes(user.role)) {
		redirect(DASHBOARD_ROLES.includes(user.role) ? '/dashboard' : '/');
	}
	return user;
}

export { getSessionUser };
