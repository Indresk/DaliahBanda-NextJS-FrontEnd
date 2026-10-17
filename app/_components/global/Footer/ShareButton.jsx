'use client';

import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import Button from '@/frontend/components/buttons/GeneralButton';

export default function ShareButton() {
	async function handleShare() {
		try {
			if (navigator.share) {
				await navigator.share({
					title: document.title,
					text: document
						.querySelector('meta[name="description"]')
						?.getAttribute('content'),
					url: window.location.href,
				});
			} else {
				throw new Error();
			}
		} catch {
			await navigator.clipboard.writeText(window.location.href);
			//implementar modal que alerte al usuario que se copio el enlace a la pagina en su portapapeles
		}
	}

	return (
		<Button
			variant='ghost'
			size='noPadding'
			aria-label='Compartir'
			onClick={handleShare}
			className='h-6 text-primary hover:scale-110 hover:text-primary'>
			<MSOIcon>share</MSOIcon>
		</Button>
	);
}
