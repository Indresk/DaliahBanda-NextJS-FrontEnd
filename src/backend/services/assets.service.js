import 'server-only';

import { ERROR_CODES } from '../../shared/errors/error.codes';
import {
	ASSET_MAX_SIZE_BYTES,
	ASSET_TYPES,
	ASSET_UPLOAD,
	ENCRYPTION_PURPOSES,
} from '../../shared/constants';
import {
	assetKeySchema,
	assetPrefixSchema,
	assetUploadSchema,
} from '../../shared/schemas';
import AppError from '../errors/app.error';
import { getPublicUrl } from '../integrations/r2.client';
import AssetsRepository from '../repositories/assets.reposity';
import { buildAssetKey } from '../utils/assetKeys';
import { decrypt, encrypt } from '../utils/encryption';
import { detectMimeType } from '../utils/fileSignature';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

const PURPOSE = ENCRYPTION_PURPOSES.ASSET_UPLOAD;
const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

// Reglas de los assets del sitio (bucket de R2): explorador, subida directa y borrado.
// Los archivos no pasan por el servidor: se suben con una URL firmada y luego se verifican.
class AssetsService {
	// Contenido de una carpeta (un nivel, como un explorador de archivos)
	static async list(rawPrefix, continuationToken) {
		const prefix = parseOrThrow(assetPrefixSchema, rawPrefix);
		const { folders, objects, nextToken } = await AssetsRepository.list(
			prefix,
			continuationToken,
		);

		return {
			prefix,
			folders: folders.map((folder) => ({
				prefix: folder,
				name: folder.slice(prefix.length, -1),
			})),
			files: objects
				// Se omite el marcador de la propia carpeta (objeto vacío)
				.filter((object) => object.key !== prefix && object.size > 0)
				.map((object) => ({
					...object,
					name: object.key.slice(prefix.length),
					url: getPublicUrl(object.key),
					isImage: IMAGE_EXTENSIONS.test(object.key),
				})),
			nextToken,
		};
	}

	// Paso 1: valida lo que declara el navegador y devuelve la URL firmada para subir
	static async createUpload(upload) {
		const { prefix, name, type } = parseOrThrow(assetUploadSchema, upload);

		const key = buildAssetKey(prefix, name, ASSET_TYPES[type]);
		if (await AssetsRepository.head(key)) {
			throw new AppError(ERROR_CODES.ASSET_ALREADY_EXISTS);
		}

		// El token enlaza la confirmación con esta subida: sin él, confirmUpload podría
		// usarse para borrar archivos que ya existen en el bucket.
		const token = encrypt(
			JSON.stringify({
				key,
				type,
				expiresAt: Date.now() + ASSET_UPLOAD.CONFIRM_MAX_AGE_MS,
			}),
			PURPOSE,
		);

		return successResponseWrapper(
			{
				uploadUrl: await AssetsRepository.createPutUrl(key, type),
				token,
				key,
				headers: {
					'Content-Type': type,
					'Cache-Control': ASSET_UPLOAD.CACHE_CONTROL,
				},
			},
			'URL de subida creada',
		);
	}

	// Paso 2: R2 no puede imponer tamaño ni tipo al recibir (no soporta POST con política),
	// así que se comprueba lo que realmente quedó guardado y se borra si no cumple.
	static async confirmUpload(token) {
		const upload = AssetsService.#readUploadToken(token);
		const head = await AssetsRepository.head(upload.key);
		if (!head) throw new AppError(ERROR_CODES.ASSET_NOT_FOUND);

		const rejectWith = async (code) => {
			await AssetsRepository.remove(upload.key);
			throw new AppError(code);
		};

		if (!head.ContentLength) await rejectWith(ERROR_CODES.FILE_REQUIRED);
		if (head.ContentLength > ASSET_MAX_SIZE_BYTES) {
			await rejectWith(ERROR_CODES.FILE_TOO_LARGE);
		}

		const start = await AssetsRepository.readStart(
			upload.key,
			ASSET_UPLOAD.SIGNATURE_BYTES,
		);
		const detected = detectMimeType(start);
		if (detected !== upload.type || head.ContentType !== upload.type) {
			await rejectWith(ERROR_CODES.INVALID_FILE_TYPE);
		}

		return successResponseWrapper(
			{ key: upload.key, url: getPublicUrl(upload.key) },
			'Archivo subido',
		);
	}

	static async remove(rawKey) {
		const key = parseOrThrow(assetKeySchema, rawKey);
		if (!(await AssetsRepository.head(key))) {
			throw new AppError(ERROR_CODES.ASSET_NOT_FOUND);
		}

		await AssetsRepository.remove(key);
		return successResponseWrapper({ key }, 'Archivo eliminado');
	}

	static #readUploadToken(token) {
		let upload;
		try {
			upload = JSON.parse(decrypt(token, PURPOSE));
		} catch {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'Token de subida inválido.');
		}

		if (Date.now() > upload.expiresAt) {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'La subida expiró. Inténtalo de nuevo.');
		}

		return { ...upload, key: parseOrThrow(assetKeySchema, upload.key) };
	}
}

export default AssetsService;
