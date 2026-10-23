'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export default function FadeImage({ className, onLoad, priority, ...props }) {
	const ref = useRef(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const image = ref.current;
		if (image && !(image.complete && image.naturalWidth > 0)) setLoading(true);
	}, []);

	if (priority)
		return <Image priority className={className} onLoad={onLoad} {...props} />;

	return (
		<Image
			ref={ref}
			className={twMerge(
				'bg-darkgray transition-opacity duration-500 motion-reduce:transition-none',
				loading ? 'opacity-0' : 'opacity-100',
				className,
			)}
			onLoad={(event) => {
				setLoading(false);
				onLoad?.(event);
			}}
			{...props}
		/>
	);
}
