import { ERROR_CODES } from './error.codes.js';

export const errorsDictionary = {
	[ERROR_CODES.USER_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró el usuario solicitado',
	},
	[ERROR_CODES.USER_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'El usuario ya existe',
	},
	[ERROR_CODES.INVALID_USER_ROLE]: {
		statusCode: 400,
		message: 'El rol de usuario no es válido',
	},
	[ERROR_CODES.DATABASE_ERROR]: {
		statusCode: 500,
		message: 'Ocurrió un error en la base de datos',
	},
	[ERROR_CODES.INTERNAL_SERVER_ERROR]: {
		statusCode: 500,
		message: 'Error interno del servidor',
	},
	[ERROR_CODES.CONFIG_ERROR]: {
		statusCode: 500,
		message: 'Ocurrió un error de configuración',
	},
	[ERROR_CODES.ROUTE_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró la ruta solicitada',
	},
	[ERROR_CODES.BAD_REQUEST]: {
		statusCode: 400,
		message: 'No se proporcionaron los datos necesarios para esa solicitud',
	},
	[ERROR_CODES.FILE_REQUIRED]: {
		statusCode: 400,
		message: 'Se requiere un archivo para completar esta solicitud',
	},
	[ERROR_CODES.INVALID_FILE_TYPE]: {
		statusCode: 400,
		message: 'El tipo de archivo proporcionado no es válido',
	},
	[ERROR_CODES.FILE_TOO_LARGE]: {
		statusCode: 413,
		message: 'El archivo excede el tamaño máximo permitido',
	},
	[ERROR_CODES.INVALID_DOCUMENT_TYPE]: {
		statusCode: 400,
		message: 'El tipo de documento proporcionado no es válido',
	},
	[ERROR_CODES.UPLOAD_ERROR]: {
		statusCode: 500,
		message: 'Ocurrió un error al intentar subir el archivo',
	},
	[ERROR_CODES.UNAUTHORIZED]: {
		statusCode: 401,
		message: 'No autorizado. Por favor inicia sesión',
	},
	[ERROR_CODES.MISSING_AUTH_HEADER]: {
		statusCode: 401,
		message: 'Header de autorización requerido',
	},
	[ERROR_CODES.INVALID_AUTH_HEADER]: {
		statusCode: 401,
		message: 'Formato de autorización inválido',
	},
	[ERROR_CODES.FORBIDDEN]: {
		statusCode: 403,
		message: 'Acceso denegado',
	},
	[ERROR_CODES.INSUFFICIENT_PERMISSIONS]: {
		statusCode: 403,
		message: 'No tienes permisos suficientes para realizar esta acción',
	},
};
