'use client';

import { usePlayerStore } from '@/frontend/stores/playerStore';
import BigPlayButton from '@/frontend/assets/svg/BigPlayButton';

export default function PlayButton({ track, queue, children }) {
	const playTrack = usePlayerStore((state) => state.playTrack);

	return (
		<button
			onClick={() => playTrack(track, queue)}
			className='demo-button'
			type='button'>
			{children ?? <BigPlayButton className='w-full text-primary' />}
		</button>
	);
}
