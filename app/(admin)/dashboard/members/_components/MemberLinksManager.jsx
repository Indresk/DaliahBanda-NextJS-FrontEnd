'use client';

import Badge from '@/frontend/components/ui/Badge';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createMemberLink,
	deleteMemberLink,
	updateMemberLink,
} from '@/back/actions/members.actions';
import { MEMBER_LINK_KINDS } from '@/shared/constants';
import ChildItem from '../../_components/ChildItem';

const KIND_LABELS = {
	[MEMBER_LINK_KINDS.CONTACT]: 'Contacto',
	[MEMBER_LINK_KINDS.PROJECT]: 'Proyecto',
};

// Campos comunes de crear y editar un enlace
function LinkForm({
	memberId,
	link,
	action,
	submitLabel,
	resetOnSuccess = false,
}) {
	const { state, pending, handleSubmit } = useFormAction(action, {
		resetOnSuccess,
	});
	const prefix = `link-${link?.id ?? 'new'}`;

	return (
		<form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-4'>
			<input type='hidden' name='memberId' value={memberId} />
			{link && <input type='hidden' name='id' value={link.id} />}
			<Field label='Tipo' htmlFor={`${prefix}-kind`}>
				<select
					id={`${prefix}-kind`}
					name='kind'
					defaultValue={link?.kind ?? MEMBER_LINK_KINDS.CONTACT}
					className={controlClass}>
					{Object.entries(KIND_LABELS).map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</Field>
			<Field label='Nombre' htmlFor={`${prefix}-label`}>
				<input
					id={`${prefix}-label`}
					name='label'
					required
					maxLength={80}
					defaultValue={link?.label ?? ''}
					className={controlClass}
				/>
			</Field>
			<Field label='URL (https)' htmlFor={`${prefix}-url`}>
				<input
					id={`${prefix}-url`}
					name='url'
					type='url'
					required
					defaultValue={link?.url ?? ''}
					className={controlClass}
				/>
			</Field>
			<Field label='Orden' htmlFor={`${prefix}-order`}>
				<input
					id={`${prefix}-order`}
					name='displayOrder'
					type='number'
					min={0}
					defaultValue={link?.displayOrder ?? 0}
					className={controlClass}
				/>
			</Field>
			<div className='flex items-center gap-4 md:col-span-4'>
				<Button
					type='submit'
					size='sm'
					variant={pending ? 'disabled' : 'primary'}>
					{submitLabel}
				</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

export default function MemberLinksManager({ memberId, links }) {
	return (
		<div className='flex flex-col gap-6'>
			<LinkForm
				memberId={memberId}
				action={createMemberLink}
				submitLabel='Añadir enlace'
				resetOnSuccess
			/>
			<ul>
				{links.map((link) => (
					<ChildItem
						key={link.id}
						id={link.id}
						label={`el enlace "${link.label}"`}
						onDelete={deleteMemberLink}
						summary={
							<>
								<Badge tone='neutral'>{KIND_LABELS[link.kind]}</Badge>
								<strong>{link.label}</strong>
								<span className='truncate text-xs text-lightgray'>
									{link.url}
								</span>
							</>
						}
						editForm={
							<LinkForm
								memberId={memberId}
								link={link}
								action={updateMemberLink}
								submitLabel='Guardar'
							/>
						}
					/>
				))}
			</ul>
		</div>
	);
}
