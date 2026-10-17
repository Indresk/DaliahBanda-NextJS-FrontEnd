import RangeInput from '@/frontend/components/inputs/RangeInput';
import Button from '@/frontend/components/buttons/GeneralButton';

function getVolumeIcon(volume) {
	if (volume === 0) return 'volume_off';
	if (volume < 0.5) return 'volume_down';
	return 'volume_up';
}

export default function VolumeControl({ volume, onToggleMute, onChange }) {
	return (
		<div className='hidden items-center justify-end gap-2 md:flex'>
			<Button
				variant='ghost'
				size='noPadding'
				aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
				onClick={onToggleMute}>
				<span className='material-symbols-outlined'>
					{getVolumeIcon(volume)}
				</span>
			</Button>
			<RangeInput
				min={0}
				max={1}
				step={0.01}
				value={volume}
				onChange={(e) => onChange(Number(e.target.value))}
				progress={volume * 100}
				className='player-range max-w-28'
				aria-label='Volumen'
			/>
		</div>
	);
}
