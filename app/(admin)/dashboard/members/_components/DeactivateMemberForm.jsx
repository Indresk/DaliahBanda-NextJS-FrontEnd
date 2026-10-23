'use client';

import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { deactivateMember } from '@/back/actions/members.actions';
import { MONTH_NAMES } from '@/shared/constants';

// Baja de un miembro: despublica, cierra su formación y quita la marca de integrante actual de su
// etiqueta de galería. Pide solo la fecha de salida.
export default function DeactivateMemberForm({ member }) {
	const { state, pending, handleSubmit } = useFormAction(deactivateMember);
	const now = new Date();

	function confirmAndSubmit(event) {
		if (!window.confirm(`¿Dar de baja a "${member.name}"? Dejará de verse en el sitio.`)) {
			event.preventDefault();
			return;
		}
		handleSubmit(event);
	}

	return (
		<form onSubmit={confirmAndSubmit} className='mt-6 flex flex-col gap-4 border-t border-black pt-4'>
			<input type='hidden' name='id' value={member.id} />
			<div>
				<h3 className='font-bold'>Dar de baja</h3>
				<p className='text-xs text-lightgray'>
					Despublica a {member.name}, cierra con esta fecha sus entradas abiertas de la formación y
					quita la marca de integrante actual de su etiqueta de galería. Sus fotos y su ficha se conservan.
				</p>
			</div>
			<div className='flex flex-wrap items-end gap-4'>
				<Field label='Año de salida' htmlFor='dm-year'>
					<input id='dm-year' name='endYear' type='number' min={1990} max={2100} required defaultValue={now.getFullYear()} className={controlClass} />
				</Field>
				<Field label='Mes (opcional)' htmlFor='dm-month'>
					<select id='dm-month' name='endMonth' defaultValue={now.getMonth() + 1} className={controlClass}>
						<option value=''>Sin mes</option>
						{MONTH_NAMES.map((name, index) => (
							<option key={name} value={index + 1}>{name}</option>
						))}
					</select>
				</Field>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'secondary'}>Dar de baja</Button>
			</div>
			<FeedbackMessage result={state} />
		</form>
	);
}
