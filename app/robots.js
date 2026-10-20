export default function robots() {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/private/', '/dashboard', '/login', '/api/', '/*?preview=', '/*?token='],
		},
		sitemap: 'https://daliahbanda.com/sitemap.xml',
	};
}
