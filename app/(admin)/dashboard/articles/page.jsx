import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import ArticlesService from '@/back/services/articles.service';
import { ARTICLE_STATUS, ARTICLE_STATUS_LABELS, USER_ROLES } from '@/shared/constants';
import { articlePath } from '@/shared/utils/articles';
import { formatDateOnly } from '@/shared/utils/format';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';
import ArticleStatusButton from './_components/ArticleStatusButton';

export const metadata = { title: 'Manifiestos' };

export default async function ArticlesPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const articles = await ArticlesService.findAll();

	return (
		<>
			<PageTitle
				title='Manifiestos'
				description='Artículos de la sección pública /manifiestos: imagen principal, sinopsis, contenido enriquecido, etiquetas y autores. Los borradores no se ven en el sitio.'
			/>
			<Card
				title={`Artículos (${articles.length})`}
				action={
					<span className='flex gap-4 font-headline text-sm uppercase'>
						<a href='/dashboard/articles/export' download className='underline'>Exportar JSON (para seed)</a>
						<Link href='/dashboard/articles/new' className='underline'>Nuevo</Link>
					</span>
				}>
				<ul>
					{articles.map((article) => (
						<li key={article.id} className='flex flex-wrap items-center gap-3 border-t border-black py-3'>
							<strong className='min-w-0'>{article.title}</strong>
							<Badge tone={article.status === ARTICLE_STATUS.PUBLISHED ? 'ok' : 'warn'}>
								{ARTICLE_STATUS_LABELS[article.status]}
							</Badge>
							<span className='text-xs text-lightgray'>
								{formatDateOnly(article.displayDate)}
								{article.tagNames.length > 0 && ` · ${article.tagNames.join(', ')}`}
							</span>
							<span className='ml-auto flex items-center gap-4 text-xs'>
								<ArticleStatusButton id={article.id} status={article.status} />
								{article.status === ARTICLE_STATUS.PUBLISHED && (
									<Link href={articlePath(article.slug)} target='_blank' className='underline'>Ver</Link>
								)}
								<Link href={`/dashboard/articles/${article.id}`} className='underline'>Editar</Link>
							</span>
						</li>
					))}
				</ul>
			</Card>
		</>
	);
}
