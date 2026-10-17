import Button from '@/frontend/components/buttons/GeneralButton';

export default function PlaybackControls({
	isPlaying,
	isLastTrack,
	onPrev,
	onTogglePlay,
	onNext,
}) {
	return (
		<div className='col-start-2 row-start-1 flex items-center gap-2 '>
			<Button
				variant='ghost'
				size='noPadding'
				className='material-symbols-outlined'
				aria-label='Anterior'
				onClick={onPrev}>
				skip_previous
			</Button>
			<Button
				variant='ghost'
				size='noPadding'
				aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
				onClick={onTogglePlay}
				className='size-10 rounded-full bg-primary text-white hover:scale-105 hover:text-white'>
				<span className='material-symbols-outlined'>
					{isPlaying ? 'pause' : 'play_arrow'}
				</span>
			</Button>
			<Button
				variant='ghost'
				size='noPadding'
				aria-label='Siguiente'
				onClick={onNext}
				disabled={isLastTrack}
				className='disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-lightgray material-symbols-outlined'>
				skip_next
			</Button>
		</div>
	);
}
