'use client';

import { useRouter } from 'next/navigation';
import SongOptions from '@/components/buttons/SongOptions';

export default function YmalItem({ song }) {
	const navigate = useRouter();

	function handlePlay() {
		// apertura a link temporal
		window.open(song.link, '_blank');
	}

	function handleCopy() {
		//implementar apertura de alert que avise que se copio
		navigator.clipboard.writeText(song.link);
	}

	return (
		<article className='flex flex-col border-lightgray border-b m-2 pb-2 gap-2 w-fit'>
			<div className='flex gap-2 items-center justify-center'>
				<svg
					className='text-primary'
					width='63'
					height='63'
					viewBox='0 0 72 72'
					fill='currentColor'
					xmlns='http://www.w3.org/2000/svg'>
					{song.type == 'album' ? (
						<>
							<g filter='url(#filter0_d_38_383)'>
								<g clipPath='url(#clip0_38_383)'>
									<g clipPath='url(#clip1_38_383)'>
										<path d='M68 64H4V0H68V64ZM36 14C26.0589 14 18 22.0589 18 32C18 41.9411 26.0589 50 36 50C45.9411 50 54 41.9411 54 32C54 22.0589 45.9411 14 36 14ZM36 15C45.3888 15 53 22.6112 53 32C53 41.3888 45.3888 49 36 49C26.6112 49 19 41.3888 19 32C19 22.6112 26.6112 15 36 15ZM36 17C27.7157 17 21 23.7157 21 32C21 40.2843 27.7157 47 36 47C44.2843 47 51 40.2843 51 32C51 23.7157 44.2843 17 36 17ZM36 30C37.1046 30 38 30.8954 38 32C38 33.1046 37.1046 34 36 34C34.8954 34 34 33.1046 34 32C34 30.8954 34.8954 30 36 30ZM36 31C35.4477 31 35 31.4477 35 32C35 32.5523 35.4477 33 36 33C36.5523 33 37 32.5523 37 32C37 31.4477 36.5523 31 36 31Z' />
									</g>
								</g>
							</g>
							<defs>
								<filter
									id='filter0_d_38_383'
									x='0'
									y='0'
									width='72'
									height='72'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dy='4' />
									<feGaussianBlur stdDeviation='2' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_38_383'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect1_dropShadow_38_383'
										result='shape'
									/>
								</filter>
								<clipPath id='clip0_38_383'>
									<rect
										width='64'
										height='64'
										fill='white'
										transform='translate(4)'
									/>
								</clipPath>
								<clipPath id='clip1_38_383'>
									<rect x='4' width='64' height='64' rx='32' fill='white' />
								</clipPath>
							</defs>
						</>
					) : (
						<path d='M53 0V13H36V50H35.9893C35.7262 57.2242 29.7884 63 22.5 63C15.0442 63 9 56.9558 9 49.5C9 42.0442 15.0442 36 22.5 36C26.7411 36 30.5251 37.9559 33 41.0146V0H53Z' />
					)}
				</svg>
				<div className='flex flex-col'>
					<small className='tracking-tighter font-headline uppercase text-[12px] text-primary'>
						{song.type}
					</small>
					<h4 className='tracking-tighter font-headline uppercase text-1xl font-bold'>
						{song.name}
					</h4>
				</div>
			</div>
			<div className='flex justify-center'>
				<SongOptions onClick={handlePlay} />
				<SongOptions onClick={handleCopy} lastChild variant='link' />
			</div>
		</article>
	);
}
