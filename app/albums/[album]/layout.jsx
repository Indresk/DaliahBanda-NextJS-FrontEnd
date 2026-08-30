import Image from 'next/image';

export default function AlbumLayout({ children }) {
	/* Sidebar de álbum */
	return (
		<div className='flex flex-col md:flex-row w-full'>
			<div className='albumCard basis-full md:basis-1/3 shrink-0 grow bg-primary p-6'>
				<div className='relative w-full aspect-square mb-4 overflow-hidden'>
					<Image
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						src='https://assets.daliahbanda.com/images/backstage/backstage-usb2-v1.jpg'
						alt=''
						fill
						className='object-cover'
					/>
				</div>
				<h1 className='text-5xl font-semibold text-white'>{'Disco 1'}</h1>
				<h2 className='text-2xl mb-10 text-white'>{'Frase Simple'}</h2>
				<h2 className='text-lg font-semibold text-white '> Sobre el album</h2>
				<p className='text-gray-300'></p>
			</div>
			<div className='basis-full md:basis-2/3 p-6 grow'>{children}</div>
		</div>
	);
}
