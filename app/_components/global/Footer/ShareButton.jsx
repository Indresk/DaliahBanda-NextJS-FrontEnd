'use client';

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
		<span
			onClick={handleShare}
			className='material-symbols-outlined cursor-pointer hover:scale-110 transition-transform h-[24px]'>
			share
		</span>
	);
}
