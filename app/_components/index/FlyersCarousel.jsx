import './carousel.css';
import Image from 'next/image';

const flyers = [
	{
		link: 'https://assets.daliahbanda.com/images/flyers/cine-y-tv-2-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Cine y TV 2',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/cine-y-tv-3-v1.jpeg',
		alt: 'Daliah Banda en el flyer del evento Cine y TV 3',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/cine-y-tv-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Cine y TV',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/dx-festival2-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento DX Festival 2',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/espectros-sonoros-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Espectros Sonoros',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/grange-1-v1.webp',
		alt: 'Daliah Banda en el flyer del evento Grange 1',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/grange-2-v1.webp',
		alt: 'Daliah Banda en el flyer del evento Grange 2',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/jersey-1-v1.webp',
		alt: 'Daliah Banda en el flyer del evento Jersey 1',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/kaiju-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Kaiju',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/nostalgia-fest-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Nostalgia Fest',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/rock-and-blend-1-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Rock and Blend 1',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/rock-and-blend-2-v1.webp',
		alt: 'Daliah Banda en el flyer del evento Rock and Blend 2 v1',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/rock-and-blend-2-v2.jpg',
		alt: 'Daliah Banda en el flyer del evento Rock and Blend 2 v2',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/rock-and-blend-3-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Rock and Blend 3 v1',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/rock-and-blend-3-v2.webp',
		alt: 'Daliah Banda en el flyer del evento Rock and Blend 3 v2',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/tariama-a-la-sala-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Tariama a la Sala',
	},
	{
		link: 'https://assets.daliahbanda.com/images/flyers/tus-raices-v1.jpg',
		alt: 'Daliah Banda en el flyer del evento Tus Raíces',
	},
];

export default function FlyersCarousel() {
	return (
		<section className='flex flex-col px-8 pb-14 md:px-14 gap-8 '>
			<h2 className='tracking-tighter font-headline uppercase font-bold text-3xl md:text-5xl'>
				Trayectoria y <span className='text-primary-light'>presentaciones</span>
			</h2>
			<div className='w-full relative no-scrollbar overflow-hidden '>
				<div className='wrapper flex mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]'>
					<FlyerGroup />
					<FlyerGroup isHidden />
				</div>
			</div>
			<div className='text-[12px]'>
				<p className='mb-4 md:mb-0'>
					Como Daliah hemos participado diversos espacios de la{' '}
					<strong>escena rock bogotana</strong> como The Music Hall, The Grange
					Bar Records, La Chorizería, Jersey Bar y Jackass Rock Bar.
				</p>
				<p>
					También hemos sido parte de eventos{' '}
					<strong>culturales y educativos</strong>, incluyendo presentaciones en
					la Universidad Nacional de Colombia y en la Universidad San
					Buenaventura.
				</p>
			</div>
		</section>
	);
}

function FlyerGroup({ isHidden = false }) {
	return (
		<div aria-hidden={isHidden} className='flex min-h-20 gap-4 animation pr-4'>
			{flyers.map((event, i) => (
				<picture
					key={i}
					className='card flex grow-0 shrink-0 basis-[10em] lg:basis-[20em] relative aspect-square'>
					<Image
						fill
						loading='lazy'
						src={event.link}
						alt={event.alt}
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</picture>
			))}
		</div>
	);
}
