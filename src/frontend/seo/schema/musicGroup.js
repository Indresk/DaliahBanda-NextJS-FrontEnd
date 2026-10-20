import { SITE } from '../site';
import { MUSIC_GROUP_ID } from './ids';
import { buildAlbumRef, buildRecordingRef } from './music';
import { buildPersonRef } from './person';

// La banda: miembros activos, álbumes y canciones publicados (todo viene de la base de datos)
export function buildMusicGroupSchema({ members, albums, songs }) {
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
		member: members.map((member) => ({
			'@type': 'OrganizationRole',
			roleName: member.instrument,
			member: buildPersonRef(member),
		})),
		album: albums.map(buildAlbumRef),
		track: songs.map((song) => buildRecordingRef(song.album, song)),
	};
}
