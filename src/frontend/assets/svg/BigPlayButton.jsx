export default function BigPlayButton({ className, ...props }) {
	return (
		<svg
			viewBox='0 0 69 69'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			className={className + ' rounded-full'}
			{...props}>
			<path d='M69 69H0V0H69V69ZM27.9863 19.2627C26.6532 18.5075 25.0002 19.4708 25 21.0029V48.1387C25.0002 49.671 26.6531 50.6344 27.9863 49.8789L51.9297 36.3105C53.2812 35.5443 53.2814 33.5962 51.9297 32.8301L27.9863 19.2627Z' />
		</svg>
	);
}
