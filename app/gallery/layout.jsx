import { getGalleryMembers } from '@/back/services/gallery.cache';
import FilterSelector from './_components/FilterSelector';

export default async function GalleryView({ children }) {
	const members = await getGalleryMembers();

	return (
		<>
			<section className='p-8 md:p-14'>
				<h1 className='text-4xl md:text-6xl lg:text-8xl uppercase '>
					Eventos <br /> <strong>En vivo</strong>
				</h1>
			</section>
			<section className='searcher flex flex-wrap gap-4 px-8 md:p-14 items-center'>
				<FilterSelector members={members} />
			</section>
			<>{children}</>
		</>
	);
}
