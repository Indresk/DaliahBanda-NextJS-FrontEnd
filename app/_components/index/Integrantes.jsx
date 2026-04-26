'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const integrantes = [
	{
		id: 0,
		name: 'Silvia Berrio',
		inst: 'Voz principal',
		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-205-v1.jpg',
			width: 1622,
			height: 1080,
		},
		desc: 'Corporativa estudiante de día, cantante y cambiaformas de noche.',
	},
	{
		id: 1,
		name: 'Rafael Salcedo',
		inst: 'Teclados',
		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-14-v1.jpg',
			width: 1622,
			height: 1080,
		},

		desc: 'Me complico mucho la vida.',
	},
	{
		id: 2,
		name: '"Mike" Villaizan',
		inst: 'Guitarra principal',

		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-189-v1.jpg',
			width: 1622,
			height: 1080,
		},
		desc: 'El formula 1: 95% Gear, 5% Técnica.',
	},
	{
		id: 3,
		name: 'Jesús "AYA" Ardiles',
		inst: 'Guitarra rítmica y coros',
		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-183-v1.jpg',
			width: 1622,
			height: 1080,
		},
		desc: 'Funciono a base de cafeina y estrés.',
	},
	{
		id: 4,
		name: 'Christian Ramírez',
		inst: 'Bajo y coros',
		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/misc/unal-cris-v2.jpeg',
			width: 1280,
			height: 852,
		},
		desc: 'Bajista y economista, ambas las hace igual de bien, igual de mal.',
	},
	{
		id: 5,
		name: 'Nicolás Araújo',
		inst: 'Bateria y coros',
		photo: {
			img: 'https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-22-v1.jpg',
			width: 1622,
			height: 1080,
		},
		desc: 'Ante la duda helado de vainilla con cabanos.',
	},
];

export default function Integrantes() {
	const intervalRef = useRef(null);
	const [current, setCurrent] = useState(0);

	let selected = integrantes[current];
	let availables = [...integrantes];
	availables.splice(current, 1);

	function startInterval() {
		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % integrantes.length);
		}, 7300);
	}

	function handleSelectedChange(i) {
		selected = integrantes[i];
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
			<div className='flex flex-col md:flex-row gap-4 md:gap-8'>
				<div className='flex flex-col basis-[40%] justify-center md:pt-30 order-2 md:order-1'>
					<h4 className='tracking-tighter font-headline uppercase font-bold text-2xl'>
						{selected.name}
					</h4>
					<h5 className='tracking-tighter font-headline uppercase text-sm text-lightgray'>
						{selected.inst}
					</h5>
					<p className='text-sm md:text-base'>{selected.desc}</p>
				</div>
				<picture className='basis-[60%] order-1 md:order-2 relative'>
					<Image
						width={selected.photo.width}
						height={selected.photo.height}
						src={selected.photo.img}
						alt={`${selected.name} interpretando ${selected.inst.toLowerCase()} en una presentación en vivo de Daliah Banda.`}
					/>
					<span
						key={current}
						className='absolute bottom-0 left-0 w-full border-primary border-b-2 origin-left scale-x-100 starting:scale-x-0 transition-[scale] duration-7000 ease-linear'></span>
				</picture>
			</div>
			<div className='overflow-auto w-full'>
				<div className='flex w-[230%] md:w-full gap-4 md:gap-8'>
					{availables.map((p) => (
						<picture
							className='w-full cursor-pointer hover:border-primary md:border-b-2 '
							key={p.id}
							onClick={() => handleSelectedChange(p.id)}>
							<Image
								className='aspect-video'
								width={p.photo.width}
								height={p.photo.height}
								src={p.photo.img}
								alt={`${p.name} interpretando ${p.inst.toLowerCase()} en una presentación en vivo de Daliah Banda.`}
							/>
						</picture>
					))}
				</div>
			</div>
		</div>
	);
}
