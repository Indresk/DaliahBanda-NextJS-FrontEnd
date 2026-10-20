import 'server-only';

import { createVerify } from 'node:crypto';

// Kick firma `${messageId}.${timestamp}.${cuerpo}` con RSA SHA-256 (PKCS#1 v1.5)
export function isKickSignatureValid({
	publicKey,
	signature,
	messageId,
	timestamp,
	rawBody,
}) {
	try {
		const verifier = createVerify('RSA-SHA256');
		verifier.update(`${messageId}.${timestamp}.${rawBody}`);
		return verifier.verify(publicKey, Buffer.from(signature, 'base64'));
	} catch {
		return false;
	}
}
