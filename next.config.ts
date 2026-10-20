import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
