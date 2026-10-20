'use client';

import Button from '@/frontend/components/buttons/GeneralButton';
import YmalItem from '../../albums/_components/YmalItem';
import BigPlayButton from '@/frontend/assets/svg/BigPlayButton';
import Image from 'next/image';
import { songs } from '../../../src/shared/lib/songs';

const { ymal, ...song } = songs[0];

export default function RecommendedSong() {
	function handleRecommend() {
		//temporal, ajustar para que inicie el player interno
		window.open(
			'https://open.spotify.com/artist/4Au3rSGOcVHXd0ufiEbmEZ',
			'_blank',
		);
	}

	return (
		<section className='play-music-container bg-darkgray'>
			{/* <Link to='/albums'> */}
			<Button onClick={handleRecommend} fullWidth size='lg' rigthArrow>
				<h2>Nuestra música</h2>
			</Button>
			{/* </Link> */}
			<div className='song-info-container px-8 py-14 md:px-14 flex flex-col lg:flex-row gap-7'>
				<div className='title-container flex flex-col justify-center order-2 lg:order-1 gap-8 basis-[50%] xl:basis-[70%]'>
					<div className='description-section flex items-center gap-4'>
						<BigPlayButton
							onClick={handleRecommend}
							className='text-primary w-full hidden md:flex basis-20 shrink-0 cursor-pointer hover:scale-120 transition-transform'
						/>
						<div className='basis-full md:basis-[80%] '>
							<small className='tracking-tighter font-headline uppercase text-[12px] text-primary'>
								{song.type + ' - ' + song.year}
							</small>
							<h3 className='song-title tracking-tighter font-headline uppercase font-bold text-2xl'>
								{song.name}
							</h3>

							<p className='song-description'> {song.description}</p>
						</div>
					</div>
					<div className='streaming-platforms grid grid-cols-4 mt-7 '>
						<span>Spotify</span>
						<span>Apple Music</span>
						<span>Youtube Music</span>
						<span>Amazon Music</span>
					</div>
					<hr className='text-lightgray' />
					<div className='flex justify-around items-center flex-wrap md:flex-nowrap w-full'>
						<h3 className='tracking-tighter font-headline uppercase font-bold text-2xl hidden md:block'>
							Podría interesarte
						</h3>
						<YmalItem song={ymal[0]} />
						<YmalItem song={ymal[1]} />
					</div>
				</div>
				<div className='song-image-container relative order-1 lg:order-2 flex items-center basis-[50%]'>
					<Image
						width={song.cover.width}
						height={song.cover.height}
						sizes='(min-width: 1024px) 50vw, 100vw'
						src={song.cover.img}
						className='aspect-square'
						alt={'Portada oficial de ' + song.name + '.'}
					/>
					<div className='w-full absolute bottom-4 left-4'>
						<BigPlayButton
							onClick={handleRecommend}
							className='text-primary w-[20%] md:hidden cursor-pointer hover:scale-120 transition-transform'
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
