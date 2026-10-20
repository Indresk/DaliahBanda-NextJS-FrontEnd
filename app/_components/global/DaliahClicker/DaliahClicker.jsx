'use client';

import { useState } from 'react';
import './styles.css';
import DaliahLogo from '@/frontend/assets/svg/DaliahLogo';
import { usePreferencesStore } from '@/frontend/stores/preferencesStore';

function DaliahClicker() {
	const daliahCookieCount = usePreferencesStore((s) => s.daliahClicks);
	const incrementClicks = usePreferencesStore((s) => s.incrementClicks);
	const [cookieSideBar, setCookieSideBar] = useState(false);

	return (
		<div
			className={`fixed z-10 top-0 right-0 flex items-center font-doto h-full text-white transition-translate duration-300 ease-in-out${cookieSideBar ? `` : ` translate-x-[85vw] lg:translate-x-[30vw]`}`}>
			<div
				id='cookie-bookmark'
				onClick={() => setCookieSideBar((prev) => !prev)}>
				<div className='cookie-bookmark-container flex flex-col justify-center items-center'>
					<DaliahLogo />
					<p className='text-[10px]'>{daliahCookieCount}</p>
				</div>
			</div>
			<aside id='full-clicker' className='w-[85vw] lg:w-[30vw]'>
				<div className='full-clicker-header'>
					<p className='text-white'>{'---> DaliGalletas <----'}</p>
				</div>
				<div className='full-clicker-window flex flex-col justify-center items-center gap-4'>
					<button
						className='cookie-button w-25 flex justify-center items-center'
						onClick={incrementClicks}>
						<DaliahLogo />
					</button>
					<p className='text-lg'>{daliahCookieCount}</p>
				</div>
			</aside>
		</div>
	);
}

export default DaliahClicker;
