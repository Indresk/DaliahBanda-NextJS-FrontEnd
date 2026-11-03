import { notFound, permanentRedirect } from 'next/navigation';
import { ARTICLES } from '@/shared/constants';
import ArticlesListing from '../../_components/ArticlesListing';
import { listingMetadata } from '../../_lib/listingMetadata';

// "/pagina/2" → 2; texto o números que no son una página (0, 1.5, "abc") → null
const parsePage = (raw) => (/^[1-9]\d*$/.test(raw) ? Number(raw) : null);

export async function generateMetadata({ params }) {
	const page = parsePage((await params).page);
	return page ? listingMetadata({ page }) : {};
}

// Páginas numeradas del listado. La página 1 es /manifiestos: no se duplica con otra URL.
export default async function ArticlesNumberedPage({ params }) {
	const page = parsePage((await params).page);
	if (!page) notFound();
	if (page === 1) permanentRedirect(ARTICLES.BASE_PATH);

	return <ArticlesListing page={page} />;
}
