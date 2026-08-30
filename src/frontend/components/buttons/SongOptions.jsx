const variants = {
	play: {
		icon: 'play_arrow',
		copy: 'Escuchar',
	},
	stems: {
		icon: 'library_music',
		copy: 'Stems',
	},
	score: {
		icon: 'audio_file',
		copy: 'Partituras',
	},
	lyrics: {
		icon: 'lyrics',
		copy: 'Letra y acordes',
	},
	link: {
		icon: 'share',
		copy: 'Compartir',
	},
};

export default function SongOptions({
	lastChild = false,
	variant = 'play',
	className = '',
	...props
}) {
	const current = variants[variant];

	const classes = [
		'group flex border-primary  gap-2 items-center cursor-pointer',
		lastChild ? '' : 'pr-2 mr-2 border-r-2',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={classes} {...props}>
			<span className='material-symbols-outlined cursor-pointer group-hover:scale-110 transition-transform h-[24px] text-primary'>
				{current.icon}
			</span>
			<p className='tracking-tighter font-headline uppercase text-[12px]'>
				{current.copy}
			</p>
		</div>
	);
}
