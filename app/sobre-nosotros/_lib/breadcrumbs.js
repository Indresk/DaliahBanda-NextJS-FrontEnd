// Migas de la sección Sobre nosotros: Sobre nosotros / Integrantes / <miembro>.
// Las usan la franja visible (@breadcrumb) y el JSON-LD, para que ambas digan lo mismo.
export function aboutCrumbs({
	members = false,
	member = null,
	contact = false,
	comunity = false,
} = {}) {
	const crumbs = [{ label: 'Sobre nosotros', href: '/sobre-nosotros' }];
	if (members || member)
		crumbs.push({ label: 'Integrantes', href: '/sobre-nosotros/integrantes' });
	if (member)
		crumbs.push({
			label: member.name,
			href: `/sobre-nosotros/integrantes/${member.slug}`,
		});
	if (contact)
		crumbs.push({ label: 'Contacto', href: '/sobre-nosotros/contacto' });
	if (comunity)
		crumbs.push({ label: 'Comunidad', href: '/sobre-nosotros/comunidad' });
	return crumbs;
}
