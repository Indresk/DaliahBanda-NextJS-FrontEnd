'use client';

import { useState } from 'react';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';

const buttonClass =
	'flex cursor-pointer items-center gap-2 border border-lightgray px-3 py-2 font-headline text-xs uppercase tracking-tight transition-colors hover:border-primary hover:bg-primary';

export default function ShareButtons({ url, title }) {
	const [feedback, setFeedback] = useState('');

	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const networks = [
		{
			name: 'Facebook',
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		},
		{
			name: 'X',
			href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
		},
		{
			name: 'WhatsApp',
			href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
		},
		{
			name: 'Reddit',
			href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
		},
	];

	function notify(message) {
		setFeedback(message);
		setTimeout(() => setFeedback(''), 3000);
	}

	async function copyLink(message) {
		try {
			await navigator.clipboard.writeText(url);
			notify(message);
		} catch {
			notify('No se pudo copiar el enlace');
		}
	}

	return (
		<section aria-label='Compartir el artículo' className='flex flex-col gap-3'>
			<h2 className='font-headline text-sm font-bold uppercase tracking-tighter'>
				Compartir
			</h2>
			<ul className='flex flex-wrap gap-2'>
				{networks.map((network) => (
					<li key={network.name}>
						<a
							href={network.href}
							target='_blank'
							rel='noopener noreferrer'
							aria-label={`Compartir en ${network.name}`}
							className={buttonClass}>
							{network.name}
						</a>
					</li>
				))}
				<li>
					<button
						type='button'
						onClick={() => copyLink('Enlace copiado')}
						className={buttonClass}>
						<MSOIcon className='text-base'>content_copy</MSOIcon>
						Copiar enlace
					</button>
				</li>
			</ul>
			<p role='status' className='min-h-5 text-sm text-primary-light'>
				{feedback}
			</p>
		</section>
	);
}
