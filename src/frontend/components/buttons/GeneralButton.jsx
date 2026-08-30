const variants = {
	primary: {
		button: 'bg-primary text-white hover:text-primary',
		fill: 'bg-white border-primary border-y',
	},
	secondary: {
		button:
			'border-2 border-primary text-primary bg-transparent hover:text-white',
		fill: 'bg-primary border-white border-y',
	},
	invert: {
		button: 'bg-white text-primary hover:text-white',
		fill: 'bg-primary border-white border-y',
	},
	textLink: {
		button: 'bg-transparent text-white hover:text-primary',
		fill: 'bg-white',
	},
	ghost: {
		button: 'bg-transparent text-primary hover:text-white',
		fill: 'bg-primary',
	},
};

const sizes = {
	noPadding: 'text-base',
	sm: 'px-4 py-2 text-sm',
	md: 'px-6 py-2 text-base',
	lg: 'px-8 py-3 text-lg',
};

export default function Button({
	children,
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	className = '',
	rigthArrow = false,
	...props
}) {
	const current = variants[variant];

	const classes = [
		'group relative isolate flex items-center justify-center gap-4 font-headline font-bold uppercase cursor-pointer transition-all duration-300',
		sizes[size],
		current.button,
		fullWidth ? 'w-full' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			className={`${classes} ${variant !== 'textLink' && 'overflow-hidden'}`}
			{...props}>
			<span
				className={[
					'absolute inset-y-0 left-[-1%] w-0 -z-10 transition-all duration-700 group-hover:w-[101%]',
					rigthArrow && variant === 'textLink' && 'group-hover:w-[109%]',
					current.fill,
				].join(' ')}
			/>
			<span className='relative z-10 flex items-center gap-4'>
				{children}
				{rigthArrow && (
					<span className='material-symbols-outlined group-hover:translate-x-5'>
						arrow_right_alt
					</span>
				)}
			</span>
		</button>
	);
}
