import Link from 'next/link';
import { formatDateOnly } from '@/shared/utils/format';

// Autores: el miembro enlaza a su página; sin autores se muestra "Anónimo"
function Authors({ authors }) {
	if (!authors.length) return <span>Anónimo</span>;

	return (
		<span>
			Por{' '}
			{authors.map((author, index) => (
				<span key={`${author.name}-${index}`}>
					{index > 0 && (index === authors.length - 1 ? ' y ' : ', ')}
					{author.memberSlug ? (
						<Link
							href={`/sobre-nosotros/integrantes/${author.memberSlug}`}
							className='text-white hover:text-primary-light hover:underline'>
							{author.name}
						</Link>
					) : (
						<span className='text-white'>{author.name}</span>
					)}
				</span>
			))}
		</span>
	);
}

// Fecha que ve el público, tiempo de lectura y autores
export default function ArticleByline({ article }) {
	return (
		<p className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-lightgray'>
			<time dateTime={article.displayDate}>
				{formatDateOnly(article.displayDate)}
			</time>
			<span aria-hidden='true'>-</span>
			<span>{article.readingMinutes} min de lectura</span>
			<span aria-hidden='true'>-</span>
			<Authors authors={article.authors} />
		</p>
	);
}
