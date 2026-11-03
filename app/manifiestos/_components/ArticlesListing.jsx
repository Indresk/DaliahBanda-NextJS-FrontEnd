import { notFound } from 'next/navigation';
import { getArticleTags, getArticlesPage } from '@/back/services/articles.cache';
import { articlesPagePath } from '@/shared/utils/articles';
import BreadcrumbTrail from '@/frontend/components/ui/BreadcrumbTrail';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildArticleListSchema } from '@/frontend/seo/schema/article';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { articlesCrumbs } from '../_lib/breadcrumbs';
import ArticleCard from './ArticleCard';
import Pagination from './Pagination';
import TagList from './TagList';

// Listado paginado de artículos: landing /manifiestos, sus páginas numeradas y las páginas de etiqueta.
// Responde 404 si la página o la etiqueta no existen (getArticlesPage devuelve null).
export default async function ArticlesListing({ page, tagSlug = null }) {
	const [data, tags] = await Promise.all([getArticlesPage(page, tagSlug), getArticleTags()]);
	if (!data) notFound();

	const { articles, totalPages, tag } = data;
	const crumbs = articlesCrumbs({ tag });
	const name = tag ? `Manifiestos sobre ${tag.name}` : 'Manifiestos';

	return (
		<div className='mx-auto flex max-w-7xl flex-col gap-10 px-8 py-14 md:px-14'>
			<JsonLd data={buildArticleListSchema({ articles, name, path: articlesPagePath(page, tagSlug) })} />
			<JsonLd data={buildBreadcrumbSchema(crumbs)} />

			<header className='flex flex-col gap-4'>
				{tag && <BreadcrumbTrail items={crumbs} />}
				<h1 className='font-headline text-4xl font-bold uppercase tracking-tighter md:text-6xl'>
					{tag ? (
						<>
							Sobre <span className='text-primary-light'>{tag.name}</span>
						</>
					) : (
						<span className='text-primary-light'>Manifiestos</span>
					)}
				</h1>
				<p className='max-w-2xl text-lightgray'>
					{tag
						? `Artículos de Daliah Banda sobre ${tag.name}.`
						: 'Ideas, posturas y reflexiones de Daliah Banda sobre música, escena alternativa y los temas de nuestras canciones.'}
				</p>
				<TagList tags={tags} counts label='Temas' />
			</header>

			{articles.length > 0 ? (
				<ul className='flex flex-col gap-10'>
					{articles.map((article, index) => (
						<li key={article.id} className='border-b border-darkgray pb-10 last:border-b-0'>
							<ArticleCard article={article} priority={index === 0} />
						</li>
					))}
				</ul>
			) : (
				<p className='text-lightgray'>Pronto publicaremos nuestros manifiestos.</p>
			)}

			<Pagination page={page} totalPages={totalPages} tagSlug={tagSlug} />
		</div>
	);
}
