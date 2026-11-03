import { notFound, permanentRedirect } from 'next/navigation';
import { articleTagPath } from '@/shared/utils/articles';
import ArticlesListing from '../../../../_components/ArticlesListing';
import { listingMetadata } from '../../../../_lib/listingMetadata';

const parsePage = (raw) => (/^[1-9]\d*$/.test(raw) ? Number(raw) : null);

export async function generateMetadata({ params }) {
	const { tag, page: rawPage } = await params;
	const page = parsePage(rawPage);
	return page ? listingMetadata({ page, tagSlug: tag }) : {};
}

// Páginas numeradas de una etiqueta; la página 1 es la raíz de la etiqueta
export default async function ArticleTagNumberedPage({ params }) {
	const { tag, page: rawPage } = await params;
	const page = parsePage(rawPage);
	if (!page) notFound();
	if (page === 1) permanentRedirect(articleTagPath(tag));

	return <ArticlesListing page={page} tagSlug={tag} />;
}
