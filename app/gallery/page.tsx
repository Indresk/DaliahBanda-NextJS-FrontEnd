import Link from 'next/link';

export default function GalleryIndex() {
	return (
		<>
			<section className='flex gap-4 px-8 md:p-14'>
				<div>
					<Link href='/gallery/events/rock-and-blend-1'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/live/unal/misc/unal-cris-v1.jpeg'
									alt='Chris tocando durante la primera etapa del Rock And Blend en la UNAL'
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>Rock And Blend 1</h3>
							</div>
						</div>
					</Link>
					<Link href='/gallery/events/rock-and-blend-2'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-62-v1.jpg'
									alt=''
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>Rock And Blend 2</h3>
							</div>
						</div>
					</Link>
					<Link href='/gallery/events/rock-and-blend-3'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/live/unal/show-randb3/unal-postentrevista-3-v1.jpg'
									alt='Toda la banda posando durante la entrevista despues de la tercera edición del Rock and Blend.'
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>Rock And Blend 3</h3>
							</div>
						</div>
					</Link>
				</div>
				<div>
					<Link href='/gallery/events/usb-2025'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/backstage/backstage-usb2-v1.jpg'
									alt='Banda posando antes del evento en la Universidad San Buenaventura'
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>
									Universidad San Buenaventura
								</h3>
							</div>
						</div>
					</Link>
					<Link href='/gallery/events/otros-eventos'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/live/cambridge/cambridge-scenario-v1.jpeg'
									alt='Banda tocando en vivo en el colegio Cambridge en bogotá'
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>Otros Eventos</h3>
							</div>
						</div>
					</Link>
					<Link href='/gallery/events/misc'>
						<div className='grid h-100 overflow-hidden w-full'>
							<picture className='[grid-area:1/1]'>
								<img
									src='https://assets.daliahbanda.com/images/backstage/backstage-lunch-2022-v1.jpg'
									alt='Banda comiendo hamburgesas despues de ensayo'
								/>
							</picture>
							<div className='[grid-area:1/1] z-1 p-2'>
								<h3 className='uppercase font-bold'>Variado</h3>
							</div>
						</div>
					</Link>
				</div>
			</section>
		</>
	);
}
