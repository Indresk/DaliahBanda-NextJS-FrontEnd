import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';

// Caché de lecturas públicas con una etiqueta por dominio (galería, música, miembros...).
//  wrap(fn, keyParts)  versión en caché de `fn` (cada combinación de argumentos se guarda por separado)
//  invalidate()        descarta todo lo cacheado con la etiqueta; lo llaman las acciones del dashboard
// `revalidate` (segundos) es el respaldo: caduca aunque nadie invalide.
// Es el único lugar que usa `unstable_cache`, obsoleto en Next 16 (lo reemplaza `use cache`, que
// exige activar Cache Components en todo el proyecto): migrar aquí no toca a los dominios.
export function createTaggedCache({ tag, revalidate }) {
	const options = { tags: [tag], revalidate };

	return {
		wrap: (fn, keyParts) => unstable_cache(fn, keyParts, options),
		invalidate: () => revalidateTag(tag, { expire: 0 }),
	};
}
