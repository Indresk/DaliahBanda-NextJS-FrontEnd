'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BreadCrumb() {
	const pathname = usePathname();
	const pathnames = pathname.split('/').filter((p) => p);

	const getPath = (index: number) => {
		return '/' + pathnames.slice(0, index + 1).join('/');
	};

	const capitalize = (str: string) => {
		return (
			str.charAt(0).toUpperCase() +
			str.slice(1).replace(/-[a-z]/g, (m) => ' ' + m[1].toUpperCase())
		);
	};

	return (
		<aside className='p-1 py-2 h-full w-7.5 border-r-black dark:border-r-white border-r'>
			<div className='flex rotate-90 items-center gap-x-2 text-sm whitespace-nowrap'>
				{pathnames.map((name, index) => {
					const routeTo = getPath(index);
					const isLast = index === pathnames.length - 1;

					return (
						<div key={routeTo} className='flex gap-x-2'>
							{index > 0 && <span className='opacity-50'>/</span>}

							{isLast ? (
								<span className='font-medium text-gray-500 dark:text-gray-400'>
									{capitalize(name)}
								</span>
							) : (
								<Link
									href={routeTo}
									replace
									className='cursor-pointer hover:underline'>
									{capitalize(name)}
								</Link>
							)}
						</div>
					);
				})}
			</div>
		</aside>
	);
}
