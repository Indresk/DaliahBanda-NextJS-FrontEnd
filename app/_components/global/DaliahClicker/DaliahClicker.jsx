'use client';

import { useState, useEffect } from 'react';
import './styles.css';
import Image from 'next/image';

function DaliahClicker() {
	const [daliahCookieCount, setDaliahCookieCount] = useState(0);
	const [cookieSideBar, setCookieSideBar] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem('daliahClicks');
		if (stored) {
			setDaliahCookieCount(Number(stored));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('daliahClicks', daliahCookieCount);
	}, [daliahCookieCount]);

	return (
		<div
			className={`fixed z-10 top-[0px] right-[0px] flex items-center font-doto h-full text-white transition-translate duration-300 ease-in-out${cookieSideBar ? `` : ` translate-x-[85vw] lg:translate-x-[30vw]`}`}>
			<div
				id='cookie-bookmark'
				onClick={() => setCookieSideBar((prev) => !prev)}>
				<div className='cookie-bookmark-container flex flex-col justify-center items-center'>
					<Image
						width={763.92}
						height={763.92}
						className='invert'
						src='https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg'
						alt='Logo de Daliah Banda'
					/>
					<p className='text-[10px]'>{daliahCookieCount}</p>
				</div>
			</div>
			<aside id='full-clicker' className='w-[85vw] lg:w-[30vw]'>
				<div className='full-clicker-header'>
					<p className='text-white'>{'---> DaliGalletas <----'}</p>
				</div>
				<div className='full-clicker-window flex flex-col justify-center items-center gap-4'>
					<button
						className='cookie-button w-[100px] flex justify-center items-center'
						onClick={() => {
							setDaliahCookieCount(daliahCookieCount + 1);
						}}>
						<Image
							width={763.92}
							height={763.92}
							className='invert'
							src='https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg'
							alt='Logo de Daliah Banda'
						/>
					</button>
					<p className='text-lg'>{daliahCookieCount}</p>
				</div>
			</aside>
		</div>
	);
}

export default DaliahClicker;
