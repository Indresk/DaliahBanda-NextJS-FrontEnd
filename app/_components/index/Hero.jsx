import Image, { getImageProps } from 'next/image';

export default function Hero() {
	const common = {
		alt: 'Banda Daliah posando en vivo, metalcore y pop emo punk desde Bogotá',
		priority: true,
	};

	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 2700,
		height: 1080,
		src: 'https://assets.daliahbanda.com/images/hero/hero-home-lg-2700-1080-v1.webp',
	});

	const {
		props: { srcSet: mobile, ...rest },
	} = getImageProps({
		...common,
		width: 1280,
		height: 960,
		src: 'https://assets.daliahbanda.com/images/hero/hero-home-sm-1280-960-v2.webp',
	});
	return (
		<section id='hero' className='overflow-hidden'>
			<div className='grid'>
				<div className='[grid-area:1/1] z-1 flex items-end p-4 md:p-6 lg:p-10 bg-linear-to-tr from-black/80 via-black/20 to-transparent'>
					<div className='grid'>
						<Image
							width={1200}
							height={619}
							unoptimized
							className='invert w-40 md:w-60 h-auto [grid-area:1/1]'
							src='https://assets.daliahbanda.com/brand/logos/full/logo-daliah-vector-black-v1.webp'
							alt='Logo principal de Daliah Banda en blanco con fondo transparente'
						/>
						<div className='[grid-area:1/1]'>
							<h1 className='text-white uppercase text-[8px] md:text-[11px] pl-[90px] md:pl-[135px] pt-[57px] md:pt-[86px]'>
								Daliah Banda - Metalcore y Pop Emo Punk desde Bogotá
							</h1>
						</div>
					</div>
				</div>
				<picture className='[grid-area:1/1]'>
					<source media='(min-width: 768px)' srcSet={desktop} />
					<img
						{...rest}
						srcSet={mobile}
						style={{ width: '100%', height: 'auto' }}
						alt='Daliah Banda tocando en vivo en escenario de rock alternativo en Bogotá'
					/>
				</picture>
			</div>
		</section>
	);
}
