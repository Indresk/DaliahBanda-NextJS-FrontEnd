import RangeInput from '@/frontend/components/inputs/RangeInput';
import { formatTime } from '@/shared/utils/formatTime';

export default function SeekBar({ seekRef, time, duration, onScrub }) {
	const progress = duration > 0 ? Math.min((time / duration) * 100, 100) : 0;

	return (
		<div className='col-span-2 row-start-2 flex w-full items-center gap-3 text-xs tabular-nums text-lightgray'>
			<span className='w-10 text-right'>{formatTime(time)}</span>
			<RangeInput
				ref={seekRef}
				min={0}
				max={duration || 0}
				step={0.1}
				value={Math.min(time, duration || 0)}
				disabled={!duration}
				onChange={(e) => onScrub(Number(e.target.value))}
				progress={progress}
				className='player-range'
				aria-label='Posición de la canción'
				aria-valuetext={`${formatTime(time)} de ${formatTime(duration)}`}
			/>
			<span className='w-10'>{formatTime(duration)}</span>
		</div>
	);
}
