'use client';

import { useState, useTransition } from 'react';
import Button from '@/frontend/components/buttons/GeneralButton';
import {
	disconnectKick,
	resubscribeKick,
	verifyKickSubscription,
} from '@/back/actions/kick.actions';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';

export default function KickActions({ connected, canEdit }) {
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function run(action, confirmText) {
		if (confirmText && !window.confirm(confirmText)) return;
		startTransition(async () => setResult(await action()));
	}

	const subscriptions = result?.payload?.subscriptions;

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-wrap gap-3'>
				{canEdit && (
					<a href='/api/v1/kick/oauth/login'>
						<Button size='sm' type='button' variant={connected ? 'secondary' : 'primary'}>
							{connected ? 'Reconectar' : 'Conectar con Kick'}
						</Button>
					</a>
				)}
				{connected && (
					<Button
						size='sm'
						type='button'
						variant={pending ? 'disabled' : 'secondary'}
						onClick={() => run(verifyKickSubscription)}>
						Verificar suscripción
					</Button>
				)}
				{connected && canEdit && (
					<>
						<Button
							size='sm'
							type='button'
							variant={pending ? 'disabled' : 'secondary'}
							onClick={() => run(resubscribeKick)}>
							Recrear suscripción
						</Button>
						<Button
							size='sm'
							type='button'
							variant={pending ? 'disabled' : 'ghost'}
							onClick={() =>
								run(
									disconnectKick,
									'¿Desconectar Kick? El sitio dejará de recibir el estado en vivo hasta que lo vuelvas a conectar.',
								)
							}>
							Desconectar
						</Button>
					</>
				)}
			</div>

			<FeedbackMessage result={result} />
			{subscriptions?.length > 0 && (
				<ul className='text-xs text-lightgray'>
					{subscriptions.map((item) => (
						<li key={item.id}>
							{item.event} (v{item.version}, {item.method})
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
