import { SITE } from '../site';
import { MUSIC_GROUP_ID } from './musicGroup';

const NAME = 'Daliah Banda - Ensayo en vivo';
const DESCRIPTION =
	'Transmisión en vivo de los ensayos oficiales de Daliah Banda vía Kick desde Bogotá, Colombia.';

const iso = (date) => new Date(date).toISOString();

export function buildLiveVideoSchema({
	isLive,
	scheduledStart,
	scheduledEnd,
	previousEnd,
	liveStartedAt,
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: NAME,
		description: DESCRIPTION,
		inLanguage: SITE.language,
		mainEntityOfPage: `${SITE.url}/live`,
		thumbnailUrl: [SITE.image.url],
		uploadDate: iso(previousEnd),
		embedUrl: SITE.kickPlayerUrl,
		publisher: { '@id': MUSIC_GROUP_ID },
		potentialAction: { '@type': 'WatchAction', target: SITE.social.kick },
		publication: [
			{
				'@type': 'BroadcastEvent',
				name: NAME,
				isLiveBroadcast: true,
				startDate: iso(
					isLive && liveStartedAt ? liveStartedAt : scheduledStart,
				),
				endDate: iso(scheduledEnd),
				...(!isLive && { eventStatus: 'https://schema.org/EventScheduled' }),
				location: { '@type': 'City', name: SITE.city },
			},
		],
	};
}
