export const USER_ROLES = Object.freeze({
	ADMIN: 'admin',
	MEMBER: 'member',
	USER: 'user',
});

export const USER_QUERY_FIELDS = Object.freeze({
	ID: 'id',
	GOOGLEID: 'googleId',
	EMAIL: 'email',
});

export const USER_UPDATABLE_FIELDS = Object.freeze({
	EMAIL: 'email',
	GOOGLEID: 'googleId',
	ROLE: 'role',
	NAME: 'name',
});

// Roles con acceso al dashboard (el proxy y cada acción del servidor lo validan)
export const DASHBOARD_ROLES = Object.freeze([
	USER_ROLES.ADMIN,
	USER_ROLES.MEMBER,
]);
