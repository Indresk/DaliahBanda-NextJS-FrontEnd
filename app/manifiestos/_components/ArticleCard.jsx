import Link from 'next/link';
import Image from '@/frontend/components/ui/FadeImage';
import { articlePath } from '@/shared/utils/articles';
import ArticleByline from './ArticleByline';
import TagList from './TagList';

// Artículo en el listado: miniatura (16:9) y, al lado, título, datos, sinopsis y etiquetas
export default function ArticleCard({ article, priority = false }) {
	return (
		<article className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
			<Link
				href={articlePath(article.slug)}
				tabIndex={-1}
				aria-hidden='true'
				className='relative block aspect-video w-full shrink-0 overflow-hidden sm:w-72 lg:w-80'>
				<Image
					fill
					priority={priority}
					src={article.imageUrl}
					alt={article.imageAlt}
					sizes='(min-width: 1024px) 320px, (min-width: 640px) 288px, 100vw'
					className='object-cover'
				/>
			</Link>
			<div className='flex min-w-0 flex-col gap-2'>
				<h2 className='font-headline text-2xl font-bold uppercase leading-tight tracking-tighter'>
					<Link href={articlePath(article.slug)} className='transition-colors hover:text-primary-light'>
						{article.title}
					</Link>
				</h2>
				<ArticleByline article={article} />
				<p className='text-sm'>{article.synopsis}</p>
				<TagList tags={article.tags} />
			</div>
		</article>
	);
}
