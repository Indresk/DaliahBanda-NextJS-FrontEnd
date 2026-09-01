export const ERROR_CODES = {
	USER_NOT_FOUND: 'user_not_found',
	USER_ALREADY_EXISTS: 'user_already_exists',
	INVALID_USER_ROLE: 'invalid_user_role',
	DATABASE_ERROR: 'database_error',
	INTERNAL_SERVER_ERROR: 'internal_server_error',
	CONFIG_ERROR: 'config_error',
	ROUTE_NOT_FOUND: 'route_not_found',
	BAD_REQUEST: 'bad_request',
	FILE_REQUIRED: 'file_required',
	INVALID_FILE_TYPE: 'invalid_file_type',
	FILE_TOO_LARGE: 'file_too_large',
	INVALID_DOCUMENT_TYPE: 'invalid_document_type',
	UPLOAD_ERROR: 'upload_error',
	UNAUTHORIZED: 'unauthorized',
	MISSING_AUTH_HEADER: 'missing_auth_header',
	INVALID_AUTH_HEADER: 'invalid_auth_header',
	FORBIDDEN: 'forbidden',
	INSUFFICIENT_PERMISSIONS: 'insufficient_permissions',
};

Object.freeze(ERROR_CODES);
