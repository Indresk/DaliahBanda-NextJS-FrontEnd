// Migas de la sección Sobre nosotros: Sobre nosotros / Integrantes / <miembro>.
// Las usan la franja visible (@breadcrumb) y el JSON-LD, para que ambas digan lo mismo.
export function aboutCrumbs({
	members = false,
	member = null,
	contact = false,
	comunity = false,
} = {}) {
	const crumbs = [{ label: 'Sobre nosotros', href: '/about-us' }];
	if (members || member)
		crumbs.push({ label: 'Integrantes', href: '/about-us/members' });
	if (member)
		crumbs.push({
			label: member.name,
			href: `/about-us/members/${member.slug}`,
		});
	if (contact) crumbs.push({ label: 'Contacto', href: '/about-us/contact' });
	if (comunity) crumbs.push({ label: 'Comunidad', href: '/about-us/comunity' });
	return crumbs;
}
