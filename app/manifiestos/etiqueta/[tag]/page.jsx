import { listingMetadata } from '../../_lib/listingMetadata';
import ArticlesListing from '../../_components/ArticlesListing';

export async function generateMetadata({ params }) {
	const { tag } = await params;
	return listingMetadata({ page: 1, tagSlug: tag });
}

// Artículos de una etiqueta
export default async function ArticleTagPage({ params }) {
	const { tag } = await params;
	return <ArticlesListing page={1} tagSlug={tag} />;
}
