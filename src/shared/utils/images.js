import { OPTIMIZED_IMAGE_HOSTS } from '../constants';

// La galería admite imágenes de cualquier sitio https, pero next/image solo puede optimizar
// las de dominios configurados. Para el resto se usa `unoptimized` en vez de romper la página.
export function isOptimizedImageUrl(url) {
	try {
		return OPTIMIZED_IMAGE_HOSTS.includes(new URL(url).hostname);
	} catch {
		return false;
	}
}
