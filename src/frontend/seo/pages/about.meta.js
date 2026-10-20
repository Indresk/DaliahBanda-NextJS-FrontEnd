export const aboutMeta = {
	title: 'Sobre nosotros',
	description:
		'Conoce la historia de Daliah Banda, banda de metalcore y pop emo punk de Bogotá con más de ocho años en la escena alternativa colombiana.',
	path: '/about-us',
};

// Los nombres salen de los miembros activos (base de datos)
export const membersMeta = (members) => ({
	title: 'Integrantes',
	description: `Los integrantes de Daliah Banda${
		members.length ? `: ${members.map((member) => member.name.replace(/"/g, '')).join(', ')}` : ''
	}, y la historia de su formación.`,
	path: '/about-us/members',
});

export const memberMeta = (member) => ({
	title: `${member.name.replace(/"/g, '')} - ${member.instrument}`,
	description: member.shortBio,
	path: `/about-us/members/${member.slug}`,
});

export const contactMeta = {
	title: 'Contacto',
	description:
		'Contacta a Daliah Banda para presentaciones, prensa y colaboraciones.',
	path: '/about-us/contact',
	indexable: false,
};
