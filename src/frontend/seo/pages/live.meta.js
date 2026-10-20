import { SITE } from '../site';

const RICH_RESULTS = {
	'max-image-preview': 'large',
	'max-snippet': -1,
	'max-video-preview': -1,
};

export const liveMeta = {
	title: {
		absolute: 'Daliah Banda en vivo | Ensayo Metalcore en Directo desde Bogotá',
	},
	description:
		'Mira a Daliah Banda en vivo durante sus ensayos de metalcore y pop emo punk desde Bogotá. Streaming oficial vía Kick.',
	path: '/live',
	keywords: [
		'Daliah en vivo',
		'Daliah streaming',
		'ensayo metalcore en vivo',
		'banda en directo Colombia',
		'Daliah Kick',
		'Daliah Banda live',
	],
	robots: {
		index: true,
		follow: true,
		...RICH_RESULTS,
		googleBot: { index: true, follow: true, ...RICH_RESULTS },
	},
	openGraph: {
		type: 'video.other',
		title: 'Daliah Banda en vivo | Ensayo oficial vía Kick',
		description:
			'Transmisión en vivo de los ensayos oficiales de Daliah Banda desde Bogotá.',
		imageAlt:
			'Daliah Banda transmitiendo ensayo en vivo de metalcore desde Bogotá',
		videos: [{ url: SITE.kickPlayerUrl, type: 'text/html' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Daliah Banda en vivo | Streaming oficial',
		description:
			'Ensayo en directo de Daliah Banda vía Kick. Metalcore y pop emo punk desde Bogotá.',
	},
};
