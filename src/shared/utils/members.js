// Texto alternativo de la imagen principal de un miembro: el propio o uno generado
export const memberImageAlt = (member) =>
	member.featuredAlt ||
	`${member.name} interpretando ${member.instrument.toLowerCase()} en una presentación en vivo de Daliah Banda.`;
