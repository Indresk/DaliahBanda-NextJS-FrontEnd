import FilterSelector from './_components/FilterSelector';

export default function GalleryView({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<section className='p-8 md:p-14'>
				<h1 className='text-4xl md:text-6xl lg:text-8xl uppercase '>
					Eventos <br /> <strong>En vivo</strong>
				</h1>
			</section>
			<section className='searcher flex gap-4 px-8 md:p-14 items-center'>
				<FilterSelector />
			</section>
			<>{children}</>
		</>
	);
}
