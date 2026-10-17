'use client';

import { useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePlayerStore } from '@/frontend/stores/playerStore';
import { useAudioSync } from '@/frontend/hooks/useAudioSync';
import { useSeek } from '@/frontend/hooks/useSeek';
import { useVolume } from '@/frontend/hooks/useVolume';
import TrackInfo from './TrackInfo';
import PlaybackControls from './PlaybackControls';
import SeekBar from './SeekBar';
import VolumeControl from './VolumeControl';
import VisibilityToggle from './VisibilityToggle';
import './player.css';

const RESTART_THRESHOLD = 3;

export default function AudioPlayer() {
	const audioRef = useRef(null);
	const [visible, setVisible] = useState(true);

	const {
		queue,
		currentIndex,
		isPlaying,
		duration,
		togglePlay,
		next,
		prev,
		setCurrentTime,
	} = usePlayerStore(
		useShallow((state) => ({
			queue: state.queue,
			currentIndex: state.currentIndex,
			isPlaying: state.isPlaying,
			duration: state.duration,
			togglePlay: state.togglePlay,
			next: state.next,
			prev: state.prev,
			setCurrentTime: state.setCurrentTime,
		})),
	);

	const currentTrack = queue[currentIndex] ?? null;
	const hasTrack = Boolean(currentTrack);
	const isLastTrack = currentIndex >= queue.length - 1;

	const { volume, toggleMute, changeVolume } = useVolume();
	useAudioSync(audioRef, currentTrack?.src, volume);
	const { seekRef, shownTime, setScrubTime } = useSeek(audioRef, hasTrack);

	function handlePrev() {
		const audio = audioRef.current;
		if (
			audio &&
			(audio.currentTime > RESTART_THRESHOLD || currentIndex === 0)
		) {
			audio.currentTime = 0;
			setCurrentTime(0);
			return;
		}
		prev();
	}

	return (
		<>
			<audio ref={audioRef} preload='metadata' />

			{hasTrack && (
				<section
					aria-label='Reproductor de audio'
					className={`fixed bottom-0 z-40 w-full ${visible ? '' : 'translate-y-full'} border-t border-primary bg-darkgray/95 text-white backdrop-blur transition-transform ease-in-out duration-300`}>
					<VisibilityToggle
						visible={visible}
						onToggle={() => setVisible((v) => !v)}
					/>
					<div className='mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:px-6'>
						<TrackInfo track={currentTrack} />

						<div className='contents md:flex md:flex-col md:items-center md:gap-1'>
							<PlaybackControls
								isPlaying={isPlaying}
								isLastTrack={isLastTrack}
								onPrev={handlePrev}
								onTogglePlay={togglePlay}
								onNext={next}
							/>
							<SeekBar
								seekRef={seekRef}
								time={shownTime}
								duration={duration}
								onScrub={setScrubTime}
							/>
						</div>

						<VolumeControl
							volume={volume}
							onToggleMute={toggleMute}
							onChange={changeVolume}
						/>
					</div>
				</section>
			)}
		</>
	);
}
