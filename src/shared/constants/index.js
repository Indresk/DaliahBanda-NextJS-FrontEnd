export const ENVIRONMENT = {
	PROD: 'production',
	DEV: 'development',
};

export const USER_ROLES = {
	ADMIN: 'admin',
	MEMBER: 'member',
	USER: 'user',
};

[(ENVIRONMENT, USER_ROLES)].forEach(Object.freeze);
