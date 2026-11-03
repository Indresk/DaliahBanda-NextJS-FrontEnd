import { listingMetadata } from './_lib/listingMetadata';
import ArticlesListing from './_components/ArticlesListing';

export const generateMetadata = () => listingMetadata({ page: 1 });

// Landing de la sección de artículos
export default function ArticlesPage() {
	return <ArticlesListing page={1} />;
}
