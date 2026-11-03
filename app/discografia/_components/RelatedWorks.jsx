import { toRelatedItems } from '../_lib/relatedItems';
import YmalItem from './YmalItem';

export default function RelatedWorks({ related }) {
	const items = toRelatedItems(related);
	if (!items.length) return null;

	return (
		<section className='bg-darkgray p-6'>
			<h2 className='mb-4 font-bold'>Otros de nuestros trabajos que podrían interesarte</h2>
			<div className='flex flex-wrap justify-around gap-4'>
				{items.map(({ key, ...item }) => (
					<YmalItem key={key} item={item} />
				))}
			</div>
		</section>
	);
}
