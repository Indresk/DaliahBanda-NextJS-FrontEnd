import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

// Par verificador/desafío de PKCE (RFC 7636, método S256)
export function createPkcePair() {
	const codeVerifier = randomBytes(32).toString('base64url');
	const codeChallenge = createHash('sha256')
		.update(codeVerifier)
		.digest('base64url');

	return { codeVerifier, codeChallenge };
}
