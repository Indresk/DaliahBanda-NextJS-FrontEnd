export const aboutMeta = {
	title: 'Sobre nosotros',
	description:
		'Conoce la historia de Daliah Banda, banda de metalcore y pop emo punk de Bogotá con más de ocho años en la escena alternativa colombiana.',
	path: '/sobre-nosotros',
};

// Los nombres salen de los miembros activos (base de datos)
export const membersMeta = (members) => ({
	title: 'Integrantes',
	description: `Los integrantes de Daliah Banda${
		members.length
			? `: ${members.map((member) => member.name.replace(/"/g, '')).join(', ')}`
			: ''
	}, y la historia de su formación.`,
	path: '/sobre-nosotros/integrantes',
});

export const memberMeta = (member) => ({
	title: `${member.name.replace(/"/g, '')} - ${member.instrument}`,
	description: member.shortBio,
	path: `/sobre-nosotros/integrantes/${member.slug}`,
});

export const contactMeta = {
	title: 'Contacto',
	description:
		'Contacta a Daliah Banda para presentaciones, prensa y colaboraciones.',
	path: '/sobre-nosotros/contacto',
	indexable: false,
};

export const comunityMeta = {
	title: 'Nuestra Comunidad',
	description:
		'Conoce y vuelvete parte de nuestra comunidad Daliah interactua con nosotros, comparte y disfruta nuestra musica.',
	path: '/sobre-nosotros/comunidad',
	indexable: false,
};
