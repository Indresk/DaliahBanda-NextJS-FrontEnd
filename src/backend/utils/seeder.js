import 'server-only';
import sequelize from '../config/db.js';
// import UserService from '../services/user.service';
// import { USER_ROLES } from '../../shared/constants';

async function seedDb() {
	await sequelize.authenticate();

	const adminEmail = process.env.ADMIN_EMAIL;
	const allowedEmails = JSON.parse(process.env.ALLOWED_EMAILS || '[]');

	if (!adminEmail || !allowedEmails) {
		console.error(
			'No se pudo continuar con el seeding, faltan variables de entorno obligatorias: ADMIN_EMAIL, ALLOWED_EMAILS',
			adminEmail,
			' || ',
			allowedEmails,
		);
		process.exit(1);
	}

	console.log('estamos bien');
}

seedDb();
