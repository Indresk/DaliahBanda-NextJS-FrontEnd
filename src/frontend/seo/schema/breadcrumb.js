import { SITE } from '../site';

// Migas de pan para buscadores a partir de las mismas migas que la franja visible (`crumbs` =
// [{ label, href }], ver albumsCrumbs / aboutCrumbs); añade "Inicio" como primer nivel.
export function buildBreadcrumbSchema(crumbs) {
	const items = [{ label: 'Inicio', href: '/' }, ...crumbs];

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.label,
			item: `${SITE.url}${crumb.href}`,
		})),
	};
}
