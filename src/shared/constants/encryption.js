// Cada uso del cifrado deriva su propia clave a partir de ENCRYPTION_KEY: un valor cifrado
// para un propósito no se puede descifrar como si fuera de otro.
export const ENCRYPTION_PURPOSES = Object.freeze({
	KICK_TOKENS: 'kick-tokens',
	KICK_OAUTH_STATE: 'kick-oauth-state',
	ASSET_UPLOAD: 'asset-upload',
});
