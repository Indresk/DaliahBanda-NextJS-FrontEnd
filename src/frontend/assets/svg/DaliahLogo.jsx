import Image from 'next/image';

const LOGO_SRC =
	'https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg';

export default function DaliahLogo({
	invert = true,
	className = '',
	...props
}) {
	const classes = [invert && 'invert', className].filter(Boolean).join(' ');

	return (
		<Image
			width={763.92}
			height={763.92}
			className={classes || undefined}
			{...props}
			src={LOGO_SRC}
			alt='Logo de Daliah Banda'
		/>
	);
}
