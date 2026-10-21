import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// Sequelize y pg se cargan con require en vez de empaquetarse: empaquetados quedan copias
	// distintas por ruta (las clases de una no se reconocen en otra: `literal` deja de funcionar) y
	// cada copia abre su propio pool de conexiones.
	serverExternalPackages: ['sequelize', 'pg', 'pg-hstore'],
	images: {
		remotePatterns: [new URL('https://assets.daliahbanda.com/**')],
	},
	async headers() {
		return [
			{
				source: '/((?!_next|api|dashboard|login|.*\\..*).*)',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
				],
			},
		];
	},
};

export default nextConfig;
