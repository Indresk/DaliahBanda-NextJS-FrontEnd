'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { integrantes } from '../../../src/shared/lib/intregantes';

export default function Integrantes() {
	const intervalRef = useRef(null);
	const [current, setCurrent] = useState(0);

	let availables = [...integrantes];
	availables.splice(current, 1);

	function startInterval() {
		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % integrantes.length);
		}, 7300);
	}

	function handleSelectedChange(i) {
		availables = [...integrantes].splice(i, 1);
		setCurrent(i);
		startInterval();
	}

	useEffect(() => {
		startInterval();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return (
		<div className='flex flex-col p-14 px-8 md:px-14 md:pt-14 gap-4 md:gap-8'>
			{integrantes.map((integrante, index) => (
				<div
					key={integrante.id}
					className={`flex flex-col md:flex-row gap-4 md:gap-8 ${current === integrante.id ? '' : 'hidden'}`}>
					<div className='flex flex-col basis-[40%] justify-center md:pt-30 order-2 md:order-1'>
						<h4 className='tracking-tighter font-headline uppercase font-bold text-2xl'>
							{integrante.name}
						</h4>
						<h5 className='tracking-tighter font-headline uppercase text-sm text-lightgray'>
							{integrante.inst}
						</h5>
						<p className='text-sm md:text-base'>{integrante.desc}</p>
					</div>
					<div className='basis-[60%] order-1 md:order-2 relative'>
						<Image
							width={integrante.photo.width}
							height={integrante.photo.height}
							sizes='(min-width: 768px) 60vw, 100vw'
							src={integrante.photo.img}
							alt={`${integrante.name} interpretando ${integrante.inst.toLowerCase()} en una presentación en vivo de Daliah Banda.`}
						/>
						<span
							key={current}
							className='absolute bottom-0 left-0 w-full border-primary border-b-2 origin-left scale-x-100 starting:scale-x-0 transition-[scale] duration-7000 ease-linear'></span>
					</div>
				</div>
			))}

			<div className='overflow-auto w-full'>
				<div className='flex w-[230%] md:w-full gap-4 md:gap-8'>
					{availables.map((p) => (
						<div
							className='w-full cursor-pointer hover:border-primary md:border-b-2 '
							key={p.id}
							onClick={() => handleSelectedChange(p.id)}>
							<Image
								draggable='false'
								className='aspect-video'
								width={p.photo.width}
								height={p.photo.height}
								sizes='(min-width: 768px) 30vw, 70vw'
								src={p.photo.img}
								alt={`${p.name} interpretando ${p.inst.toLowerCase()} en una presentación en vivo de Daliah Banda.`}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
