import { albumPath, songPath } from '@/shared/utils/music';

// Migas de la sección de música: Álbumes / <álbum> / <canción> / <recurso>.
// Las usan la franja visible (@breadcrumb) y el JSON-LD, para que ambas digan lo mismo.
export function albumsCrumbs(album, song, resource) {
	const crumbs = [{ label: 'Álbumes', href: '/discografia' }];
	if (album) crumbs.push({ label: album.title, href: albumPath(album) });
	if (song) crumbs.push({ label: song.title, href: songPath(album, song) });
	if (resource) {
		crumbs.push({ label: resource.label, href: `${songPath(album, song)}/${resource.route}` });
	}
	return crumbs;
}
