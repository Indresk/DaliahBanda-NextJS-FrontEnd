import { Link } from 'react-router';
export default function LiveBanner() {
	return (
		<section
			role='region'
			aria-label='Transmisión en vivo activa'
			className='live-banner bg-pink-800 px-4 sm:px-6 lg:px-8 z-50'>
			<div className='live-banner-content flex gap-2 justify-around flex-wrap p-2 mx-auto max-w-7xl'>
				<div className='flex gap-4 items-center grow'>
					<strong
						className='live-indicator basis-40 flex flex-row gap-3 items-center'
						aria-hidden='true'>
						<span className=''>●</span>EN VIVO
					</strong>
					<p className='place-self-center-safe'>
						Daliah Banda está transmitiendo su ensayo en directo desde Bogotá.
					</p>
				</div>
				<Link
					to='/live'
					title='Entrar al streaming en vivo de Daliah Banda'
					className='live-banner-button underline'>
					Ver transmisión ahora
				</Link>
			</div>
		</section>
	);
}
