'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useInfiniteCarousel } from '@/frontend/hooks/useInfiniteCarousel';
import './carousel.css';
import { flyers } from '../../../src/shared/lib/flyers';

export default function FlyersCarousel() {
	const scrollerRef = useRef(null);
	useInfiniteCarousel(scrollerRef);

	return (
		<section className='flex flex-col px-8 pb-14 md:px-14 gap-8 '>
			<h2 className='tracking-tighter font-headline uppercase font-bold text-3xl md:text-5xl'>
				Trayectoria y <span className='text-primary-light'>presentaciones</span>
			</h2>
			<div
				ref={scrollerRef}
				role='region'
				aria-label='Flyers de presentaciones'
				tabIndex={0}
				className='flyers-mask no-scrollbar w-full cursor-grab select-none overflow-x-auto overscroll-x-contain active:cursor-grabbing'>
				<div className='flex w-max'>
					<FlyerGroup />
					<FlyerGroup isCopy />
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

function FlyerGroup({ isCopy = false }) {
	return (
		<ul
			aria-hidden={isCopy || undefined}
			inert={isCopy}
			className='flex shrink-0 gap-4 pr-4'>
			{flyers.map((event) => (
				<li
					key={event.link}
					className='relative aspect-square size-40 shrink-0 lg:size-80'>
					<Image
						fill
						draggable={false}
						src={event.link}
						alt={event.alt}
						sizes='(min-width: 1024px) 320px, 160px'
						className='object-cover'
					/>
				</li>
			))}
		</ul>
	);
}
