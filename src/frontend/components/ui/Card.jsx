import { twMerge } from 'tailwind-merge';

export default function Card({ title, action, children, className }) {
	return (
		<section className={twMerge('bg-darkgray p-6', className)}>
			{(title || action) && (
				<div className='mb-4 flex items-center justify-between gap-4'>
					{title && (
						<h2 className='font-headline text-lg font-bold uppercase tracking-tighter'>
							{title}
						</h2>
					)}
					{action}
				</div>
			)}
			{children}
		</section>
	);
}
