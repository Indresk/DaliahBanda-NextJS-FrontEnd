import Image from 'next/image';

// Cómo se recortará la imagen principal en el sitio: masthead (3:1) y miniatura (16:9), ambos con object-cover
export default function ImageRatioPreview({ url }) {
	if (!/^https:\/\//.test(url)) return null;

	const crops = [
		{ label: 'Masthead (3:1)', className: 'aspect-[3/1]' },
		{ label: 'Miniatura (16:9)', className: 'aspect-video w-1/2' },
	];

	return (
		<div className='flex flex-col gap-3'>
			<p className='text-xs text-lightgray'>Así se recorta en el sitio (el centro de la imagen es lo que siempre se ve).</p>
			{crops.map((crop) => (
				<figure key={crop.label} className='flex flex-col gap-1'>
					<div className={`relative overflow-hidden bg-black ${crop.className}`}>
						<Image src={url} alt='' fill unoptimized sizes='400px' className='object-cover' />
					</div>
					<figcaption className='text-xs text-lightgray'>{crop.label}</figcaption>
				</figure>
			))}
		</div>
	);
}
