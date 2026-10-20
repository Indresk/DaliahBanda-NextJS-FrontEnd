import Link from 'next/link';
import { eventsFrames } from '@/shared/lib/eventsFrames';
import Image from 'next/image';

import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { galleryMeta } from '@/frontend/seo/pages/gallery.meta';

export const metadata = buildMetadata(galleryMeta);


const highlights = [];
const rows = [];

eventsFrames.forEach((event) => {
	if (event.id >= eventsFrames.length - 2) highlights.push(event);
	else rows.push(event);
});

export default function GalleryIndex() {
	return (
		<>
			<section className='flex flex-col px-8 md:p-14 gap-4'>
				<div className='grid md:grid-cols-5 gap-4'>
					<Link href={highlights[0].pageLink} className='md:col-span-3'>
						<div className='grid h-40 md:h-160 overflow-hidden w-full relative'>
							<Image
								src={highlights[0].image}
								alt={highlights[0].alt}
								loading='eager'
								fill
								sizes='(max-width: 640px) 100vw, 60vw'
								className='object-cover'
							/>
							<EventPreviewOverlay title={highlights[0].title} />
						</div>
					</Link>
					<div className='flex flex-col gap-4 h-80 md:h-160 md:col-span-2'>
						<Link href={highlights[1].pageLink} className='basis-[50%]'>
							<div className='grid h-full overflow-hidden w-full relative'>
								<Image
									src={highlights[1].image}
									alt={highlights[1].alt}
									fill
									sizes='(max-width: 640px) 100vw, 40vw'
									className='object-cover'
								/>
								<EventPreviewOverlay title={highlights[1].title} />
							</div>
						</Link>
						<Link href={highlights[2].pageLink} className='basis-[50%]'>
							<div className='grid h-full overflow-hidden w-full relative'>
								<Image
									src={highlights[2].image}
									alt={highlights[2].alt}
									fill
									sizes='(max-width: 640px) 100vw, 40vw'
									className='object-cover'
								/>

								<EventPreviewOverlay title={highlights[2].title} />
							</div>
						</Link>
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{rows.map((event) => (
						<Link href={event.pageLink} key={event.id}>
							<div className='grid h-40 md:h-80 overflow-hidden w-full relative'>
								<Image
									src={event.image}
									alt={event.alt}
									fill
									sizes='(max-width: 640px) 100vw,(max-width: 768px) 50vw, 33vw'
									className='object-cover'
								/>

								<EventPreviewOverlay title={event.title} />
							</div>
						</Link>
					))}
				</div>
			</section>
		</>
	);
}

function EventPreviewOverlay({ title }) {
	return (
		<div className='[grid-area:1/1] z-1 flex flex-col justify-end'>
			<h3 className='uppercase font-bold p-2 bg-darkgray'>{title}</h3>
		</div>
	);
}
