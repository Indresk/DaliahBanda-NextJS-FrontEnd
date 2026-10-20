import 'server-only';

import config from '../config';

export function publicUrl(path, request) {
	return new URL(path, config.AUTH_URL || request.url);
}
