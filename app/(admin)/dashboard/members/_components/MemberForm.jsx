'use client';

import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import TextEditor from '@/frontend/components/inputs/TextEditor/TextEditorLoader';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { createMember, updateMember } from '@/back/actions/members.actions';

const FEATURED_NAMES = {
	url: 'featuredUrl',
	width: 'featuredWidth',
	height: 'featuredHeight',
};

// Alta y edición de un miembro. En edición el slug no cambia (formará la URL de su página).
export default function MemberForm({ member }) {
	const isEdit = Boolean(member);
	const { state, pending, handleSubmit } = useFormAction(
		isEdit ? updateMember : createMember,
	);

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			{isEdit && <input type='hidden' name='id' value={member.id} />}

			<div className='flex flex-col gap-4'>
				<ImageUrlFields
					idPrefix='m'
					names={FEATURED_NAMES}
					urlLabel='Imagen principal (URL)'
					urlHint='La que aparece en el carrusel de integrantes del inicio.'
					initial={{
						url: member?.featuredUrl,
						width: member?.featuredWidth,
						height: member?.featuredHeight,
					}}
				/>
				<Field
					label='Texto alternativo de la imagen (opcional)'
					htmlFor='m-alt'
					hint='Si se deja vacío se genera con el nombre y el instrumento.'>
					<input
						id='m-alt'
						name='featuredAlt'
						maxLength={500}
						defaultValue={member?.featuredAlt ?? ''}
						className={controlClass}
					/>
				</Field>
			</div>

			<div className='flex flex-col gap-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Nombre' htmlFor='m-name'>
						<input
							id='m-name'
							name='name'
							required
							maxLength={80}
							defaultValue={member?.name ?? ''}
							className={controlClass}
						/>
					</Field>
					<Field label='Instrumento' htmlFor='m-instrument'>
						<input
							id='m-instrument'
							name='instrument'
							required
							maxLength={80}
							defaultValue={member?.instrument ?? ''}
							className={controlClass}
						/>
					</Field>
					{!isEdit && (
						<Field
							label='Identificador (slug, no se puede cambiar)'
							htmlFor='m-slug'
							hint='Solo minúsculas, números y guiones.'>
							<input
								id='m-slug'
								name='slug'
								required
								maxLength={80}
								pattern='[a-z0-9]+(-[a-z0-9]+)*'
								className={controlClass}
							/>
						</Field>
					)}
					<Field label='Orden' htmlFor='m-order' hint='Menor = primero.'>
						<input
							id='m-order'
							name='displayOrder'
							type='number'
							min={0}
							defaultValue={member?.displayOrder ?? 0}
							className={controlClass}
						/>
					</Field>
				</div>
				<Field
					label='Descripción corta'
					htmlFor='m-short'
					hint='Máx. 300 caracteres. Aparece en el inicio.'>
					<textarea
						id='m-short'
						name='shortBio'
						rows={2}
						required
						maxLength={300}
						defaultValue={member?.shortBio ?? ''}
						className={controlClass}
					/>
				</Field>
				<Field
					label='Descripción larga (opcional)'
					hint='Para su página personal. Texto enriquecido: títulos, listas, enlaces, imágenes (por URL, con su texto alternativo) y videos o iframes.'>
					<TextEditor name='longBio' defaultValue={member?.longBio ?? ''} />
				</Field>
				<label className='flex items-center gap-2 text-sm'>
					<input
						type='checkbox'
						name='active'
						defaultChecked={member?.active ?? false}
					/>
					Publicado (visible en el sitio)
				</label>
				<div className='flex flex-wrap items-center gap-4'>
					<Button
						type='submit'
						size='sm'
						variant={pending ? 'disabled' : 'primary'}>
						{isEdit ? 'Guardar cambios' : 'Crear miembro'}
					</Button>
					<Link href='/dashboard/members' className='text-sm underline'>
						Volver a la lista
					</Link>
				</div>
				<FeedbackMessage result={state} />
				{!isEdit && state?.status === 'success' && (
					<Link
						href={`/dashboard/members/${state.payload.id}`}
						className='text-sm underline'>
						Añadir enlaces e imágenes de apoyo
					</Link>
				)}
			</div>
		</form>
	);
}
