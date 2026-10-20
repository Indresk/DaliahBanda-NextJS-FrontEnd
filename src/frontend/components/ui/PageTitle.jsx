export default function PageTitle({ title, description }) {
	return (
		<header className='mb-8'>
			<h1 className='font-headline text-3xl font-bold uppercase tracking-tighter md:text-4xl'>
				{title}
			</h1>
			{description && <p className='mt-2 text-sm text-lightgray'>{description}</p>}
		</header>
	);
}
