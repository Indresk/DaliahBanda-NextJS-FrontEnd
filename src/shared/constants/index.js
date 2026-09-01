export const ENVIRONMENT = {
	PROD: 'production',
	DEV: 'development',
};

export const USER_ROLES = {
	ADMIN: 'admin',
	MEMBER: 'member',
	USER: 'user',
};

export const USER_QUERY_FIELDS = {
	UUID: 'id',
	GOOGLEID: 'googleId',
	EMAIL: 'email',
};

export const USER_UPDATABLE_FIELDS = {
	email: 'email',
	googleId: 'googleId',
	role: 'role',
	name: 'name',
};

[(ENVIRONMENT, USER_ROLES, USER_QUERY_FIELDS, USER_UPDATABLE_FIELDS)].forEach(
	Object.freeze,
);
