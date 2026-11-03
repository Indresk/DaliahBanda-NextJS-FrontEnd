import Link from 'next/link';

// Migas de pan horizontales (secciones sin franja lateral). `items` = [{ label, href }]: el último es la
// página actual y no es un enlace. Los datos estructurados se arman con las mismas migas.
export default function BreadcrumbTrail({ items }) {
	return (
		<nav aria-label='Ruta de navegación' className='text-sm'>
			<ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-lightgray'>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={item.href} className='flex items-center gap-x-2'>
							{index > 0 && <span aria-hidden='true'>/</span>}
							{isLast ? (
								<span aria-current='page' className='text-white'>{item.label}</span>
							) : (
								<Link href={item.href} className='hover:text-white hover:underline'>{item.label}</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
