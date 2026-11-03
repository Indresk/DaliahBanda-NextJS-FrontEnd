import Link from 'next/link';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';

export default function BackLink({ href }) {
	return (
		<Link
			href={href}
			className='flex shrink-0 items-center gap-2 text-sm text-primary-light '>
			<MSOIcon>arrow_back</MSOIcon>
			<span className='hover:underline'>Volver</span>
		</Link>
	);
}
