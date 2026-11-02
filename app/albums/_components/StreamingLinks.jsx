import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import { STREAMING_PLATFORMS } from '@/shared/constants';

// Enlaces para escuchar en otras plataformas (no pinta nada si no hay ninguno)
export default function StreamingLinks({ links }) {
	if (!links?.length) return null;

	return (
		<ul className='flex flex-wrap gap-x-6 gap-y-2'>
			{links.map((link) => (
				<li key={link.platform}>
					<a
						href={link.url}
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center gap-2 text-sm hover:text-primary-light'>
						<MSOIcon className='text-primary-light'>headphones</MSOIcon>
						{STREAMING_PLATFORMS[link.platform] ?? link.platform}
					</a>
				</li>
			))}
		</ul>
	);
}
