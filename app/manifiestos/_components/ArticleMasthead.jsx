import Image from '@/frontend/components/ui/FadeImage';

// Masthead: la imagen principal con ratio fijo 3:1 (recortada con object-cover) y el título encima
export default function ArticleMasthead({ article }) {
	return (
		<header className='relative aspect-[3/1] w-full overflow-hidden bg-darkgray'>
			<Image
				fill
				priority
				src={article.imageUrl}
				alt={article.imageAlt}
				sizes='100vw'
				className='object-cover'
			/>
			<div className='absolute inset-0 flex items-end bg-linear-to-t from-black/85 via-black/35 to-transparent'>
				<h1 className='mx-auto w-full max-w-7xl line-clamp-3 px-8 pb-3 font-headline text-xl font-bold uppercase leading-tight tracking-tighter sm:text-3xl md:px-14 md:pb-8 md:text-5xl'>
					{article.title}
				</h1>
			</div>
		</header>
	);
}
