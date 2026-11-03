// Texto → identificador para URL: sin tildes, en minúsculas y con guiones ("Rock Alternativo" → "rock-alternativo")
export function slugify(text) {
	return String(text ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}
