import { notFound } from 'next/navigation';
import {
	getArticle,
	getArticleNeighbors,
	getRelatedArticles,
} from '@/back/services/articles.cache';
import { articlePath } from '@/shared/utils/articles';
import BreadcrumbTrail from '@/frontend/components/ui/BreadcrumbTrail';
import { toEditorHtml } from '@/frontend/utils/richText';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { articleMeta } from '@/frontend/seo/pages/articles.meta';
import { buildArticleSchema } from '@/frontend/seo/schema/article';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { SITE } from '@/frontend/seo/site';
import { articlesCrumbs } from '../_lib/breadcrumbs';
import ArticleByline from '../_components/ArticleByline';
import ArticleMasthead from '../_components/ArticleMasthead';
import ArticleNav from '../_components/ArticleNav';
import RelatedArticles from '../_components/RelatedArticles';
import ShareButtons from '../_components/ShareButtons';
import TagList from '../_components/TagList';

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const article = await getArticle(slug);

	return article ? buildMetadata(articleMeta(article)) : {};
}

// Artículo: masthead con el título, contenido enriquecido a la izquierda y recomendados a la derecha
export default async function ArticlePage({ params }) {
	const { slug } = await params;
	const article = await getArticle(slug);
	if (!article) notFound();

	const [{ previous, next }, related] = await Promise.all([
		getArticleNeighbors(article.id, article.publishedAt),
		getRelatedArticles(article.id),
	]);
	const crumbs = articlesCrumbs({ article });

	return (
		<article>
			<JsonLd data={buildArticleSchema(article)} />
			<JsonLd data={buildBreadcrumbSchema(crumbs)} />

			<ArticleMasthead article={article} />

			<div className='mx-auto grid max-w-7xl gap-10 px-8 py-10 md:px-14 lg:grid-cols-[minmax(0,1fr)_20rem]'>
				<div className='flex min-w-0 flex-col gap-8'>
					<BreadcrumbTrail items={crumbs} />
					<div className='flex flex-col gap-3'>
						<ArticleByline article={article} />
						<TagList tags={article.tags} />
					</div>
					<p className='text-lg text-lightgray'>{article.synopsis}</p>

					<div className='rich-text' dangerouslySetInnerHTML={{ __html: toEditorHtml(article.content) }} />

					<ShareButtons url={`${SITE.url}${articlePath(article.slug)}`} title={article.title} />
					<ArticleNav previous={previous} next={next} />
				</div>

				<div className='lg:sticky lg:top-8 lg:self-start'>
					<RelatedArticles articles={related} />
				</div>
			</div>
		</article>
	);
}
