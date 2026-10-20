import Link from 'next/link';

// Migas de pan en vertical (franja izquierda de las secciones con layout lateral).
//  items  [{ label, href }]: el último es la página actual y no es un enlace
export default function Breadcrumb({ items }) {
	return (
		<nav
			aria-label='Ruta de navegación'
			className='p-1 py-2 h-full w-7.5 border-r-black dark:border-r-white border-r'>
			<ol className='flex rotate-90 items-center gap-x-2 text-sm whitespace-nowrap'>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={item.href} className='flex gap-x-2'>
							{index > 0 && <span aria-hidden='true' className='opacity-50'>/</span>}
							{isLast ? (
								<span aria-current='page' className='font-medium text-gray-500 dark:text-gray-400'>
									{item.label}
								</span>
							) : (
								<Link href={item.href} className='cursor-pointer hover:underline'>
									{item.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
