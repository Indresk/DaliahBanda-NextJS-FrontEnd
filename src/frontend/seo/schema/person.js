import { htmlToText } from '@/frontend/utils/richText';
import { SITE } from '../site';
import { MUSIC_GROUP_ID, memberPersonId } from './ids';

// "Jesús "AYA" Ardiles" → nombre sin apodo + apodo como alternateName
export function personNames(fullName) {
	const nickname = fullName.match(/"([^"]+)"/)?.[1];
	const withoutNickname = fullName.replace(/\s*"[^"]+"\s*/g, ' ').trim();

	if (nickname && withoutNickname.includes(' ')) {
		return { name: withoutNickname, alternateName: nickname };
	}
	return { name: fullName.replace(/"/g, '') };
}

// Persona resumida (para listas dentro de otras entidades)
export const buildPersonRef = (member) => ({
	'@type': 'Person',
	'@id': memberPersonId(member.slug),
	...personNames(member.name),
	url: `${SITE.url}/sobre-nosotros/integrantes/${member.slug}`,
});

// Página personal de un miembro
export function buildPersonSchema(member) {
	return {
		'@context': 'https://schema.org',
		...buildPersonRef(member),
		jobTitle: member.instrument,
		description: member.shortBio,
		image: member.featuredUrl,
		memberOf: { '@id': MUSIC_GROUP_ID },
		...(member.links.length && {
			sameAs: member.links.map((link) => link.url),
		}),
	};
}
