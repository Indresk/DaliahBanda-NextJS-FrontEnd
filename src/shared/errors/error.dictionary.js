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
	[ERROR_CODES.SUBSCRIBER_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró la suscripción solicitada',
	},
	[ERROR_CODES.SUBSCRIBER_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'El correo ya está suscrito',
	},
	[ERROR_CODES.INVALID_WEBHOOK_SIGNATURE]: {
		statusCode: 401,
		message: 'La firma del webhook no es válida',
	},
	[ERROR_CODES.KICK_NOT_CONNECTED]: {
		statusCode: 409,
		message: 'Kick no está conectado. Vuelve a conectar la cuenta',
	},
	[ERROR_CODES.KICK_OAUTH_ERROR]: {
		statusCode: 400,
		message: 'No se pudo completar la conexión con Kick',
	},
	[ERROR_CODES.KICK_API_ERROR]: {
		statusCode: 502,
		message: 'La API de Kick respondió con un error',
	},
	[ERROR_CODES.ALLOWED_EMAIL_NOT_FOUND]: {
		statusCode: 404,
		message: 'El correo no está en la lista de acceso',
	},
	[ERROR_CODES.ALLOWED_EMAIL_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'El correo ya está en la lista de acceso',
	},
	[ERROR_CODES.CANNOT_REMOVE_OWN_EMAIL]: {
		statusCode: 409,
		message: 'No puedes quitar tu propio correo de la lista de acceso',
	},
	[ERROR_CODES.ASSET_ALREADY_EXISTS]: {
		statusCode: 409,
		message:
			'Ya existe un archivo con ese nombre. Cambia el nombre o la versión (-v2)',
	},
	[ERROR_CODES.ASSET_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró el archivo solicitado',
	},
	[ERROR_CODES.STORAGE_ERROR]: {
		statusCode: 502,
		message: 'Ocurrió un error con el almacenamiento de archivos',
	},
	[ERROR_CODES.GALLERY_IMAGE_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró la imagen de la galería',
	},
	[ERROR_CODES.GALLERY_IMAGE_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'Esa imagen ya está en la galería',
	},
	[ERROR_CODES.GALLERY_EVENT_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró el evento',
	},
	[ERROR_CODES.GALLERY_EVENT_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'Ya existe un evento con ese identificador',
	},
	[ERROR_CODES.GALLERY_EVENT_IN_USE]: {
		statusCode: 409,
		message:
			'El evento tiene imágenes. Muévelas a otro evento antes de eliminarlo',
	},
	[ERROR_CODES.GALLERY_PERSON_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró al integrante',
	},
	[ERROR_CODES.GALLERY_PERSON_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'Ya existe un integrante con ese identificador',
	},
	[ERROR_CODES.GALLERY_PERSON_IN_USE]: {
		statusCode: 409,
		message:
			'El integrante aparece en imágenes. Quítalo de ellas antes de eliminarlo',
	},
	[ERROR_CODES.GALLERY_UNKNOWN_PEOPLE]: {
		statusCode: 400,
		message: 'Hay integrantes que no existen',
	},
	[ERROR_CODES.GALLERY_ALT_REQUIRED]: {
		statusCode: 400,
		message: 'Una imagen activa necesita texto alternativo (alt)',
	},
};
