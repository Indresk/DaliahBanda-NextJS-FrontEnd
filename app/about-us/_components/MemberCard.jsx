import Image from 'next/image';
import Link from 'next/link';
import { memberImageAlt } from '@/shared/utils/members';

// Tarjeta de un miembro activo: lleva a su página personal
export default function MemberCard({ member }) {
	return (
		<Link href={`/about-us/members/${member.slug}`} className='group flex flex-col gap-3'>
			<Image
				width={member.featuredWidth}
				height={member.featuredHeight}
				sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
				src={member.featuredUrl}
				alt={memberImageAlt(member)}
				className='aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
			/>
			<div className='border-b-2 border-transparent pb-2 group-hover:border-primary'>
				<h3 className='font-headline text-2xl font-bold uppercase tracking-tighter'>{member.name}</h3>
				<p className='font-headline text-sm uppercase tracking-tighter text-lightgray'>{member.instrument}</p>
				<p className='mt-1 text-sm'>{member.shortBio}</p>
			</div>
		</Link>
	);
}
