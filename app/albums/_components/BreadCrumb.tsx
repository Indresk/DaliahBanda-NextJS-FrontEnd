'use client';
// import { useNavigate,useLocation } from "react-router"

// export default function BreadCrumb(){
//     const navigate = useNavigate();
//     const location = useLocation();

//     const pathnames = location.pathname.split('/').filter(p => p); // ["albums", "123"]

//     const getPath = (index) => {
//         return '/' + pathnames.slice(0, index + 1).join('/');
//     };

//     const capitalize = (str) => {
//         return str.charAt(0).toUpperCase() + str.slice(1).replace(/-[a-z]/g, m => ' ' + m[1].toUpperCase());
//     };

//     return (
//         <aside className="p-1 py-2 h-full w-[30px] border-r-black dark:border-r-white border-r-1">
//             <div className="transform rotate-90 text-sm flex gap-x-2 items-center">
//                 {pathnames.map((name, index) => (
//                     <div key={index} className="flex gap-x-2">
//                         {index > 0 && <p>/</p>}
//                         <p className="cursor-pointer hover:underline" onClick={()=>navigate(getPath(index),{ replace: true })}>
//                             {capitalize(name)}
//                         </p>
//                     </div>
//                 ))}
//             </div>
//         </aside>
//     );
// }

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
