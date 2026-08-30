import { notFound } from 'next/navigation';
import PlayButton from '../../_components/global/AudioPlayer/PlayButton';
import { tracks } from '@/shared/lib/tracks';

//especifico para vistas build rendered
// Retirar dinamyc params en vistas dinamicas
// export const dynamicParams = false;

// async function getAlbum(id: string): Promise<AlbumResponse | null> {
// 	const res = await fetch(`${process.env.BACK_URL}/albums/${id}`, {
// 		cache: 'force-cache',
// 		next: { revalidate: 3600 },
// 	});

// 	console.log(res);

// 	if (!res.ok) return null;

// 	return res.json();
// }

//especifico para vistas build rendered
// async function getAlbumIds(): Promise<AlbumListItem[]> {
// 	const res = await fetch(`${process.env.BACK_URL}/albums`, {
// 		cache: 'force-cache',
// 		next: { revalidate: 3600 },
// 	});

// 	if (!res.ok) return [];

// 	return res.json();
// }

// especifico para vistas build rendered
// export async function generateStaticParams() {
// 	const albums = await getAlbumIds();

// 	return albums.map((item) => ({
// 		album: item.id,
// 	}));
// }

// export async function generateMetadata({
// 	params,
// }: PageProps): Promise<Metadata> {
// 	const { album } = await params;
// 	const albumData = await getAlbum(album);

// 	if (!albumData) {
// 		return {
// 			title: 'Álbum no encontrado',
// 			robots: {
// 				index: false,
// 				follow: false,
// 			},
// 		};
// 	}

// 	const title = albumData.title;
// 	const description =
// 		albumData.description ??
// 		`Explora el contenido del álbum ${albumData.title}.`;

// 	return {
// 		title,
// 		description,
// 		alternates: {
// 			canonical: `/albums/${album}`,
// 		},
// 		openGraph: {
// 			title,
// 			description,
// 			url: `/albums/${album}`,
// 			type: 'article',
// 			images: albumData.image ? [albumData.image] : undefined,
// 		},
// 		twitter: {
// 			card: albumData.image ? 'summary_large_image' : 'summary',
// 			title,
// 			description,
// 			images: albumData.image ? [albumData.image] : undefined,
// 		},
// 	};
// }

const albumPlaceholder = {
	name: 'test01',
};

export default async function AlbumPage({ params }) {
	const { album } = await params;
	// const albumData = await getAlbum(album);

	// if (!albumData) notFound();

	return (
		<main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			{/* <h1>{albumData.title}</h1>
			<p>{albumData.description}</p> */}
			<h1>{album}</h1>

			<section>
				<div className='albumContainer min-h-screen'>
					<div className='albumSongs text-2xl font-semibold'>
						Escucha el album aqui y donde prefieras
						<hr className='my-6 ' />
						<div className='songItem  bg-darkgray grid grid-cols-[1fr_10fr]  items-center  '>
							{/* columna 1 */}
							<div>
								<div>
									<span className='text-2xl font-bold '>#1</span>
								</div>
							</div>
							{/* columna 2 */}
							<div>
								<small className='text-sm  font-light'>{'abril 4, 2026'}</small>
								<h3 className='text-lg font-semibold'>
									{albumPlaceholder.name}
								</h3>
							</div>
							<hr className='my-6 border-lightgray w-full col-span-2 m-0' />
						</div>
					</div>
				</div>
				{/* {tracks.map((track) => (
					<div key={track.id}>
						<span>{track.title}</span>
						<PlayButton track={track} queue={tracks} />
					</div>
				))} */}
			</section>
		</main>
	);
}
