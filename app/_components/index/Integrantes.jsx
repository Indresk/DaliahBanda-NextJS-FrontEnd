'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { memberImageAlt as memberAlt } from '@/shared/utils/members';

// Carrusel de miembros activos (vienen de la base de datos, ver getActiveMembers)
export default function Integrantes({ members }) {
	const intervalRef = useRef(null);
	const [current, setCurrent] = useState(0);

	// Los demás miembros, conservando su posición para poder seleccionarlos
	const availables = members
		.map((member, index) => ({ member, index }))
		.filter(({ index }) => index !== current);

	function startInterval() {
		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % members.length);
		}, 7300);
	}

	function handleSelectedChange(i) {
		setCurrent(i);
		startInterval();
	}

	useEffect(() => {
		if (members.length < 2) return;
		startInterval();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	if (!members.length) return null;

	return (
		<div className='flex flex-col p-14 px-8 md:px-14 md:pt-14 gap-4 md:gap-8'>
			{members.map((member, index) => (
				<div
					key={member.id}
					className={`flex flex-col md:flex-row gap-4 md:gap-8 ${current === index ? '' : 'hidden'}`}>
					<div className='flex flex-col basis-[40%] justify-center md:pt-30 order-2 md:order-1'>
						<h4 className='tracking-tighter font-headline uppercase font-bold text-2xl'>
							{member.name}
						</h4>
						<h5 className='tracking-tighter font-headline uppercase text-sm text-lightgray'>
							{member.instrument}
						</h5>
						<p className='text-sm md:text-base'>{member.shortBio}</p>
					</div>
					<div className='basis-[60%] order-1 md:order-2 relative'>
						<Image
							width={member.featuredWidth}
							height={member.featuredHeight}
							sizes='(min-width: 768px) 60vw, 100vw'
							src={member.featuredUrl}
							alt={memberAlt(member)}
						/>
						<span
							key={current}
							className='absolute bottom-0 left-0 w-full border-primary border-b-2 origin-left scale-x-100 starting:scale-x-0 transition-[scale] duration-7000 ease-linear'></span>
					</div>
				</div>
			))}

			<div className='overflow-auto w-full'>
				<div className='flex w-[230%] md:w-full gap-4 md:gap-8'>
					{availables.map(({ member: p, index: i }) => (
						<div
							className='w-full cursor-pointer hover:border-primary md:border-b-2 '
							key={p.id}
							onClick={() => handleSelectedChange(i)}>
							<Image
								draggable='false'
								className='aspect-video'
								width={p.featuredWidth}
								height={p.featuredHeight}
								sizes='(min-width: 768px) 30vw, 70vw'
								src={p.featuredUrl}
								alt={memberAlt(p)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
