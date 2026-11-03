import Link from 'next/link';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import { articlePath } from '@/shared/utils/articles';

const linkClass =
	'flex flex-1 flex-col gap-1 bg-darkgray p-4 transition-colors hover:bg-primary';

// Botones al artículo justo anterior y justo siguiente en el orden de publicación
export default function ArticleNav({ previous, next }) {
	if (!previous && !next) return null;

	return (
		<nav aria-label='Otros artículos' className='flex flex-col gap-4 sm:flex-row'>
			{previous ? (
				<Link href={articlePath(previous.slug)} rel='prev' className={linkClass}>
					<span className='flex items-center gap-1 font-headline text-xs uppercase text-lightgray'>
						<MSOIcon className='text-base'>arrow_back</MSOIcon>
						Anterior
					</span>
					<span className='font-headline font-bold uppercase leading-tight tracking-tighter'>{previous.title}</span>
				</Link>
			) : (
				<span className='hidden flex-1 sm:block' />
			)}
			{next ? (
				<Link href={articlePath(next.slug)} rel='next' className={`${linkClass} sm:items-end sm:text-right`}>
					<span className='flex items-center gap-1 font-headline text-xs uppercase text-lightgray'>
						Siguiente
						<MSOIcon className='text-base'>arrow_right_alt</MSOIcon>
					</span>
					<span className='font-headline font-bold uppercase leading-tight tracking-tighter'>{next.title}</span>
				</Link>
			) : (
				<span className='hidden flex-1 sm:block' />
			)}
		</nav>
	);
}
