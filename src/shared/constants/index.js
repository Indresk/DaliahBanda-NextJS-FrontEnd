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
	ID: 'id',
	GOOGLEID: 'googleId',
	EMAIL: 'email',
};

export const USER_UPDATABLE_FIELDS = {
	EMAIL: 'email',
	GOOGLEID: 'googleId',
	ROLE: 'role',
	NAME: 'name',
};

[(ENVIRONMENT, USER_ROLES, USER_QUERY_FIELDS, USER_UPDATABLE_FIELDS)].forEach(
	Object.freeze,
);
