'use client';

import Button from '@/frontend/components/buttons/GeneralButton';
import { toRelatedItems } from '../../discografia/_lib/relatedItems';
import YmalItem from '../../discografia/_components/YmalItem';
import BigPlayButton from '@/frontend/assets/svg/BigPlayButton';
import Image from '@/frontend/components/ui/FadeImage';
import { useRouter } from 'next/navigation';
import { ALBUM_TYPE_LABELS, STREAMING_PLATFORMS } from '@/shared/constants';
import { formatDateOnly } from '@/shared/utils/format';
import { resolveSongCover, songPath, songReleaseDate } from '@/shared/utils/music';
import { usePlayerStore } from '@/frontend/stores/playerStore';
import { toPlayerTrack } from '@/frontend/utils/playerTrack';

// Canción recomendada del inicio (la destacada más reciente) y obras relacionadas.
// "Escuchar" reproduce la canción con el reproductor interno; sin audio lleva a su página.
export default function RecommendedSong({ song, related }) {
	const router = useRouter();
	const playTrack = usePlayerStore((state) => state.playTrack);
	const { album } = song;
	const cover = resolveSongCover(song, album);
	const { links } = song;
	const relatedItems = toRelatedItems(related);

	function handleRecommend() {
		if (song.audioUrl) playTrack(toPlayerTrack(song, album));
		else router.push(songPath(album, song));
	}

	return (
		<section className='play-music-container bg-darkgray'>
			{/* <Link to='/discografia'> */}
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
								{`${ALBUM_TYPE_LABELS[album.type]} - ${songReleaseDate(song, album).slice(0, 4)}`}
							</small>
							<h3 className='song-title tracking-tighter font-headline uppercase font-bold text-2xl'>
								{song.title}
							</h3>

							<p className='song-description'> {song.shortDescription}</p>
						</div>
					</div>
					{links.length > 0 && (
						<div className='streaming-platforms grid grid-cols-2 sm:grid-cols-4 mt-7 '>
							{links.map((link) => (
								<a key={link.platform} href={link.url} target='_blank' rel='noopener noreferrer' className='hover:text-primary-light'>
									{STREAMING_PLATFORMS[link.platform] ?? link.platform}
								</a>
							))}
						</div>
					)}
					{relatedItems.length > 0 && (
						<>
							<hr className='text-lightgray' />
							<div className='flex justify-around items-center flex-wrap md:flex-nowrap w-full'>
								<h3 className='tracking-tighter font-headline uppercase font-bold text-2xl hidden md:block'>
									Podría interesarte
								</h3>
								{relatedItems.map(({ key, ...item }) => (
									<YmalItem key={key} item={item} />
								))}
							</div>
						</>
					)}
				</div>
				<div className='song-image-container relative order-1 lg:order-2 flex items-center basis-[50%]'>
					<Image
						width={cover.width}
						height={cover.height}
						sizes='(min-width: 1024px) 50vw, 100vw'
						src={cover.url}
						className='aspect-square'
						alt={`Portada oficial de ${song.title}.`}
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
