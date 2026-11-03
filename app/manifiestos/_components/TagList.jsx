import Link from 'next/link';
import { articleTagPath } from '@/shared/utils/articles';

// Etiquetas del artículo: enlazan a su página de etiqueta. Con `counts`, muestra cuántos artículos tiene cada una.
export default function TagList({ tags, counts = false, label = 'Etiquetas' }) {
	if (!tags.length) return null;

	return (
		<ul aria-label={label} className='flex flex-wrap gap-2'>
			{tags.map((tag) => (
				<li key={tag.slug}>
					<Link
						href={articleTagPath(tag.slug)}
						className='inline-block bg-darkgray px-2 py-1 font-headline text-xs uppercase tracking-tight text-primary-light transition-colors hover:bg-primary hover:text-white'>
						{tag.name}
						{counts && <span className='text-lightgray'> - {tag.total}</span>}
					</Link>
				</li>
			))}
		</ul>
	);
}
