import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type RouteParams = {
	filter: string;
};

type PageProps = {
	params: Promise<RouteParams>;
};

type ImagesResponse = {
	// Definir posteriormente exactamente como necesitamos nuestro objeto
	id: string;
	title: string;
	description?: string;
	content?: string;
	image?: string;
};

async function getImages(id: string): Promise<ImagesResponse | null> {
	//definir posteriormente URL exacta del fetcheo
	const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/gallery/${id}`, {
		// Revisar opciones de cacheo ya que esto no es indispensable y podemos poner un cache:'force-cache'
		next: { revalidate: 3600 },
	});

	if (!res.ok) return null;

	return res.json();
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { filter } = await params;
	const galleryData = await getImages(filter);

	if (!galleryData) {
		return {
			title: 'Gallery no encontrado',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const title = galleryData.title;
	const description =
		galleryData.description ??
		`Explora el contenido del gallery ${galleryData.title}.`;

	return {
		title,
		description,
		alternates: {
			canonical: `/gallery/${filter}`,
		},
		openGraph: {
			title,
			description,
			url: `/gallery/${filter}`,
			type: 'article',
			images: galleryData.image ? [galleryData.image] : undefined,
		},
		twitter: {
			card: galleryData.image ? 'summary_large_image' : 'summary',
			title,
			description,
			images: galleryData.image ? [galleryData.image] : undefined,
		},
	};
}

export default async function AlbumPage({ params }: PageProps) {
	const { filter } = await params;
	// const albumData  = await getImages(album);

	// if (!albumData ) notFound();

	return (
		<main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			{/* <h1>{albumData.title}</h1>
			<p>{albumData.description}</p> */}
			<h1>{filter}</h1>
		</main>
	);
}
