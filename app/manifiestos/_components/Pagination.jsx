import Link from 'next/link';
import { articlesPagePath } from '@/shared/utils/articles';

// Páginas que se muestran: la primera, la última y las vecinas de la actual
function visiblePages(page, totalPages) {
	const pages = new Set([1, totalPages, page - 1, page, page + 1]);
	return [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
}

// Paginación con enlaces reales (rastreables); la página 1 es la raíz del listado
export default function Pagination({ page, totalPages, tagSlug = null }) {
	if (totalPages <= 1) return null;

	const linkClass = 'flex min-w-9 items-center justify-center px-3 py-2 font-headline text-sm uppercase transition-colors';
	const pages = visiblePages(page, totalPages);

	return (
		<nav aria-label='Paginación' className='flex flex-wrap items-center justify-center gap-2'>
			{page > 1 && (
				<Link href={articlesPagePath(page - 1, tagSlug)} rel='prev' className={`${linkClass} bg-darkgray hover:bg-primary`}>
					← Anterior
				</Link>
			)}
			{pages.map((n, index) => (
				<span key={n} className='contents'>
					{index > 0 && n - pages[index - 1] > 1 && <span aria-hidden='true' className='text-lightgray'>…</span>}
					{n === page ? (
						<span aria-current='page' className={`${linkClass} bg-primary`}>{n}</span>
					) : (
						<Link href={articlesPagePath(n, tagSlug)} aria-label={`Página ${n}`} className={`${linkClass} bg-darkgray hover:bg-primary`}>
							{n}
						</Link>
					)}
				</span>
			))}
			{page < totalPages && (
				<Link href={articlesPagePath(page + 1, tagSlug)} rel='next' className={`${linkClass} bg-darkgray hover:bg-primary`}>
					Siguiente →
				</Link>
			)}
		</nav>
	);
}
