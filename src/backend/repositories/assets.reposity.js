import 'server-only';

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { ASSET_UPLOAD } from '../../shared/constants';
import r2Client, { BUCKET } from '../integrations/r2.client';

const PAGE_SIZE = 200;

async function send(command) {
	try {
		return await r2Client.send(command);
	} catch (error) {
		throw new AppError(ERROR_CODES.STORAGE_ERROR, null, {
			message: error.message,
		});
	}
}
class AssetsRepository {
	static async list(prefix, continuationToken) {
		const response = await send(
			new ListObjectsV2Command({
				Bucket: BUCKET,
				Prefix: prefix,
				Delimiter: '/',
				MaxKeys: PAGE_SIZE,
				ContinuationToken: continuationToken || undefined,
			}),
		);

		return {
			folders: (response.CommonPrefixes ?? []).map((item) => item.Prefix),
			objects: (response.Contents ?? []).map((item) => ({
				key: item.Key,
				size: item.Size,
				lastModified: item.LastModified,
			})),
			nextToken: response.IsTruncated ? response.NextContinuationToken : null,
		};
	}

	static async head(key) {
		try {
			return await r2Client.send(
				new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
			);
		} catch (error) {
			if (
				error.$metadata?.httpStatusCode === 404 ||
				error.name === 'NotFound'
			) {
				return null;
			}
			throw new AppError(ERROR_CODES.STORAGE_ERROR, null, {
				message: error.message,
			});
		}
	}

	static async readStart(key, byteCount) {
		const object = await send(
			new GetObjectCommand({
				Bucket: BUCKET,
				Key: key,
				Range: `bytes=0-${byteCount - 1}`,
			}),
		);
		return await object.Body.transformToByteArray();
	}

	static async remove(key) {
		await send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
	}

	static async createPutUrl(key, contentType) {
		try {
			return await getSignedUrl(
				r2Client,
				new PutObjectCommand({
					Bucket: BUCKET,
					Key: key,
					ContentType: contentType,
				}),
				{
					expiresIn: ASSET_UPLOAD.URL_EXPIRES_SECONDS,
					signableHeaders: new Set(['content-type']),
				},
			);
		} catch (error) {
			throw new AppError(ERROR_CODES.STORAGE_ERROR, null, {
				message: error.message,
			});
		}
	}
}

export default AssetsRepository;
