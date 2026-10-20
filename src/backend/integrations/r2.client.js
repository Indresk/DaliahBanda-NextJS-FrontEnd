import 'server-only';

import { S3Client } from '@aws-sdk/client-s3';
import config from '../config/index';

const r2Client = new S3Client({
	region: 'auto',
	endpoint: config.CLOUDFLARE_R2_ENDPOINT,
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
	credentials: {
		accessKeyId: config.CLOUDFLARE_ACCESS_KEY_ID,
		secretAccessKey: config.CLOUDFLARE_SECRET_ACCESS_KEY,
	},
});

export const BUCKET = config.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL = config.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/+$/, '');

export const getPublicUrl = (key) => `${PUBLIC_URL}/${key}`;

export default r2Client;
