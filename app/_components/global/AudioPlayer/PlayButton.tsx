'use client';

import type { Track } from '@/lib/tracks';
import { usePlayerStore } from '@/stores/playerStore';
import BigPlayButton from '@/svg/BigPlayButton';

type Props = {
	track: Track;
	queue?: Track[];
	children?: React.ReactNode;
};

export default function PlayButton({ track, queue, children }: Props) {
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
