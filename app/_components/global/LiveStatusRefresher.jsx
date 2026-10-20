'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Mínimo de segundos entre dos actualizaciones, para no pedir de más al cambiar de pestaña
const MIN_INTERVAL_MS = 30_000;

// El banner y /live llegan ya correctos en el HTML. Este componente cubre la pestaña que se
// quedó abierta: al volver a ella vuelve a pedir la ruta actual al servidor, que responde
// desde la caché de Next (sin consultar la base de datos) con el estado vigente.
export default function LiveStatusRefresher() {
	const router = useRouter();
	const lastRefreshRef = useRef(0);

	useEffect(() => {
		lastRefreshRef.current = Date.now();

		function refresh() {
			if (document.visibilityState !== 'visible') return;
			if (Date.now() - lastRefreshRef.current < MIN_INTERVAL_MS) return;

			lastRefreshRef.current = Date.now();
			router.refresh();
		}

		document.addEventListener('visibilitychange', refresh);
		window.addEventListener('focus', refresh);
		return () => {
			document.removeEventListener('visibilitychange', refresh);
			window.removeEventListener('focus', refresh);
		};
	}, [router]);

	return null;
}
