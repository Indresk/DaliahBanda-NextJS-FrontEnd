import Image from 'next/image';

// Barra lateral del álbum (portada, título, frase y "Sobre el álbum"): la comparten el álbum y
// cada una de sus canciones
export default function AlbumSidebar({ album }) {
	return (
		<div className='albumCard basis-full md:basis-1/3 shrink-0 grow bg-primary p-6'>
			<div className='relative w-full aspect-square mb-4 overflow-hidden'>
				<Image
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					src={album.coverUrl}
					alt={`Portada de ${album.title}.`}
					fill
					className='object-cover'
				/>
			</div>
			<h2 className='text-5xl font-semibold text-white'>{album.title}</h2>
			{album.tagline && <p className='text-2xl mb-10 text-white'>{album.tagline}</p>}
			{album.description && (
				<>
					<h3 className='text-lg font-semibold text-white'>Sobre el álbum</h3>
					<p className='text-gray-300 whitespace-pre-line'>{album.description}</p>
				</>
			)}
		</div>
	);
}
