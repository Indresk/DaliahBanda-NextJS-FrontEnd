import 'server-only';

import { fetchWebhookPublicKey } from '../integrations/kick.client';

const REFETCH_COOLDOWN_MS = 60_000;

// Llave publicada por Kick el 2026-10-20: solo se usa si api.kick.com no responde la
// primera vez. Kick puede rotarla, por eso normalmente se pide en tiempo de ejecución.
const FALLBACK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0C0tthITvk/EjIxCGCko
YrxM7eqP4GDnUyP4BnfgJ9yaHqniNfraxTKeRv7TGkOOZviow2zcx/YP9waURfHd
cZOHU+EKA3lSFdMpezLiDGaym+FxR0iXAFZXE9VBdCCOyBeK81/m3mGScGVBNumt
6pGCZYU9DCn5oqnC6RC5pUnlHnJp+TOXW6z8Silr4Y81a/66b0FAJ6EGUVXmXXgP
FXQRTmJcLM4EgCXfNXLwExzr2MtowBwp5PYD6Usl7uZcnMIPutPdXJ0JnvqrztFC
QTvrGMxzKLKLcKQTG159jfHGJ4wKSeenvwXN8jaVJAtW7wRAooRRT8Kho7Axe8jp
qQIDAQAB
-----END PUBLIC KEY-----`;

// Estado en globalThis para sobrevivir al hot reload de desarrollo
const cache = (globalThis.__kickWebhookKey ??= {
	key: null,
	fetchedAt: 0,
	inflight: null,
});

async function load({ force }) {
	if (cache.key && !force) return cache.key;

	// Un atacante enviando firmas malas no debe poder disparar una petición saliente por cada una
	if (force && Date.now() - cache.fetchedAt < REFETCH_COOLDOWN_MS) {
		return cache.key;
	}

	// Peticiones simultáneas comparten una sola consulta a Kick
	cache.inflight ??= fetchWebhookPublicKey()
		.then((key) => {
			cache.key = key;
			return key;
		})
		.catch((error) => {
			console.warn('No se pudo obtener la llave pública de Kick', error.message);
			cache.key ??= FALLBACK_PUBLIC_KEY;
			return cache.key;
		})
		.finally(() => {
			cache.fetchedAt = Date.now();
			cache.inflight = null;
		});

	return await cache.inflight;
}

class KickWebhookKeyService {
	// Llave guardada (la pide a Kick la primera vez)
	static async get() {
		return await load({ force: false });
	}

	// Vuelve a pedirla a Kick, por si la rotaron (limitado a 1 vez por minuto)
	static async refresh() {
		return await load({ force: true });
	}
}

export default KickWebhookKeyService;
