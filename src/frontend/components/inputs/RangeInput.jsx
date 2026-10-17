export default function RangeInput({ progress, style, ...props }) {
	return (
		<input
			type='range'
			style={{ '--progress': `${progress}%`, ...style }}
			{...props}
		/>
	);
}
