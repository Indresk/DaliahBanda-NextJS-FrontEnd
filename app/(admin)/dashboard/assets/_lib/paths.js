// Enlaces del explorador de assets (la carpeta actual va en ?prefix=)
export function folderHref(prefix) {
	return prefix
		? `/dashboard/assets?prefix=${encodeURIComponent(prefix)}`
		: '/dashboard/assets';
}

// "images/live/" → [{ name: 'images', prefix: 'images/' }, { name: 'live', prefix: 'images/live/' }]
export function buildBreadcrumb(prefix) {
	const parts = prefix.split('/').filter(Boolean);
	return parts.map((name, index) => ({
		name,
		prefix: `${parts.slice(0, index + 1).join('/')}/`,
	}));
}
