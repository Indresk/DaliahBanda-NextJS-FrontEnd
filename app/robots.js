export default function robots() {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/private/', '/*?preview=', '/*?token='],
		},
		sitemap: 'https://daliahbanda.com/sitemap.xml',
	};
}
