import { integrantes } from '@/shared/lib/intregantes';
import { SITE } from '../site';

export const MUSIC_GROUP_ID = `${SITE.url}/#musicgroup`;

// Pendiente traerlas de la DB una vez estén
const FEATURED_TRACKS = [
	'El amor se acabó',
	'Intento sobrevivir',
	'Si podré',
	'Rebelión',
];

function toPerson(fullName) {
	const nickname = fullName.match(/"([^"]+)"/)?.[1];
	const withoutNickname = fullName.replace(/\s*"[^"]+"\s*/g, ' ').trim();

	if (nickname && withoutNickname.includes(' ')) {
		return {
			'@type': 'Person',
			name: withoutNickname,
			alternateName: nickname,
		};
	}
	return { '@type': 'Person', name: fullName.replace(/"/g, '') };
}

export function buildMusicGroupSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'MusicGroup',
		'@id': MUSIC_GROUP_ID,
		name: SITE.name,
		alternateName: SITE.alternateNames,
		url: SITE.url,
		image: SITE.image.url,
		description: SITE.defaultDescription,
		genre: SITE.genres,
		foundingDate: SITE.foundingYear,
		foundingLocation: {
			'@type': 'City',
			name: SITE.city,
			address: { '@type': 'PostalAddress', addressCountry: SITE.country },
		},
		email: SITE.email,
		sameAs: Object.values(SITE.social),
		member: integrantes.map((member) => ({
			'@type': 'OrganizationRole',
			roleName: member.inst,
			member: toPerson(member.name),
		})),
		track: FEATURED_TRACKS.map((name) => ({ '@type': 'MusicRecording', name })),
	};
}
