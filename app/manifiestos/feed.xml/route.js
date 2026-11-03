import { getArticlesIndex } from '@/back/services/articles.cache';
import { ARTICLES } from '@/shared/constants';
import { articlePath } from '@/shared/utils/articles';
import { escapeXml } from '@/shared/utils/xml';
import { SITE } from '@/frontend/seo/site';

const FEED_URL = `${SITE.url}${ARTICLES.BASE_PATH}/feed.xml`;

// Feed RSS 2.0 de los artículos publicados (del más reciente al más antiguo)
export async function GET() {
	const articles = await getArticlesIndex();
	const latest = articles[0]?.updatedAt ?? new Date().toISOString();

	const items = articles
		.map((article) => {
			const link = `${SITE.url}${articlePath(article.slug)}`;
			// La fecha del feed es la que ve el público (a mediodía UTC: no cambia de día según la zona horaria)
			const date = new Date(`${article.displayDate}T12:00:00Z`).toUTCString();

			return `<item>
<title>${escapeXml(article.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${date}</pubDate>
<description>${escapeXml(article.synopsis)}</description>
</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Manifiestos | ${SITE.name}</title>
<link>${SITE.url}${ARTICLES.BASE_PATH}</link>
<description>${escapeXml('Ideas, posturas y reflexiones de Daliah Banda sobre música, escena alternativa y los temas de sus canciones.')}</description>
<language>es-co</language>
<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
<atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600',
		},
	});
}
