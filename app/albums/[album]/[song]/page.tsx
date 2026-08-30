import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlayButton from '../../../_components/global/AudioPlayer/PlayButton';
import { tracks } from '@/shared/lib/tracks';

type RouteParams = {
	song: string;
};

// type SongListItem = {
// 	id: string;
// };

type PageProps = {
	params: Promise<RouteParams>;
};

// type SongResponse = {
// 	id: string;
// 	title: string;
// 	description?: string;
// 	content?: string;
// 	image?: string;
// };

//especifico para vistas build rendered
// Retirar dinamyc params en vistas dinamicas
// export const dynamicParams = false;

// async function getAlbum(id: string): Promise<SongResponse | null> {
// 	const res = await fetch(`${process.env.BACK_URL}/songs/${id}`, {
// 		cache: 'force-cache',
// 		next: { revalidate: 3600 },
// 	});

// 	console.log(res);

// 	if (!res.ok) return null;

// 	return res.json();
// }

//especifico para vistas build rendered
// async function getSongIds(): Promise<SongListItem[]> {
// 	const res = await fetch(`${process.env.BACK_URL}/songs`, {
// 		cache: 'force-cache',
// 		next: { revalidate: 3600 },
// 	});

// 	if (!res.ok) return [];

// 	return res.json();
// }

// especifico para vistas build rendered
// export async function generateStaticParams() {
// 	const songs = await getSongIds();

// 	return songs.map((item) => ({
// 		song: item.id,
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

export default async function SongPage({ params }: PageProps) {
	const { song } = await params;
	// const songData = await getAlbum(song);

	// if (!songData) notFound();

	return (
		<main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			{/* <h1>{songData.title}</h1> */}
			{/* <p>{songData.description}</p> */}
			<h1>{song}</h1>

			<section>
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
