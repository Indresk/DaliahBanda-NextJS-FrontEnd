import Link from 'next/link';
import Image from '@/frontend/components/ui/FadeImage';
import { articlePath } from '@/shared/utils/articles';
import { formatDateOnly } from '@/shared/utils/format';

// Columna derecha: artículos recomendados (aleatorios entre los publicados, fijos entre regeneraciones)
export default function RelatedArticles({ articles }) {
	if (!articles.length) return null;

	return (
		<aside aria-labelledby='related-title' className='flex flex-col gap-4 bg-darkgray p-6'>
			<h2 id='related-title' className='font-headline text-lg font-bold uppercase tracking-tighter'>
				Te puede interesar
			</h2>
			<ul className='flex flex-col gap-5'>
				{articles.map((article) => (
					<li key={article.id}>
						<Link href={articlePath(article.slug)} className='group flex flex-col gap-2'>
							<span className='relative block aspect-video w-full overflow-hidden'>
								<Image
									fill
									src={article.imageUrl}
									alt={article.imageAlt}
									sizes='(min-width: 1024px) 320px, 100vw'
									className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
								/>
							</span>
							<span className='font-headline font-bold uppercase leading-tight tracking-tighter group-hover:text-primary-light'>
								{article.title}
							</span>
							<time dateTime={article.displayDate} className='text-xs text-lightgray'>
								{formatDateOnly(article.displayDate)}
							</time>
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
}
