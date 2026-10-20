'use client';

import Image from 'next/image';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createMemberImage,
	deleteMemberImage,
	updateMemberImage,
} from '@/back/actions/members.actions';
import ChildItem from '../../_components/ChildItem';

// Alta de una imagen de apoyo (la URL y sus dimensiones no se editan: se elimina y se vuelve a añadir)
function CreateImageForm({ memberId }) {
	const { state, pending, handleSubmit } = useFormAction(createMemberImage, { resetOnSuccess: true });

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			<input type='hidden' name='memberId' value={memberId} />
			<div className='flex flex-col gap-4'>
				<ImageUrlFields idPrefix='mi' />
			</div>
			<div className='flex flex-col gap-4'>
				<Field label='Texto alternativo' htmlFor='mi-alt'>
					<textarea id='mi-alt' name='alt' rows={3} required maxLength={500} className={controlClass} />
				</Field>
				<Field label='Orden' htmlFor='mi-order' hint='Menor = primero.'>
					<input id='mi-order' name='displayOrder' type='number' min={0} defaultValue={0} className={controlClass} />
				</Field>
				<div className='flex items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Añadir imagen</Button>
					<FeedbackMessage result={state} />
				</div>
			</div>
		</form>
	);
}

function EditImageForm({ image }) {
	const { state, pending, handleSubmit } = useFormAction(updateMemberImage);

	return (
		<form onSubmit={handleSubmit} className='flex flex-wrap items-end gap-4'>
			<input type='hidden' name='id' value={image.id} />
			<input type='hidden' name='memberId' value={image.memberId} />
			<input type='hidden' name='url' value={image.url} />
			<input type='hidden' name='width' value={image.width} />
			<input type='hidden' name='height' value={image.height} />
			<Field label='Texto alternativo' htmlFor={`mia-${image.id}`} className='min-w-72 flex-1'>
				<input id={`mia-${image.id}`} name='alt' required maxLength={500} defaultValue={image.alt} className={controlClass} />
			</Field>
			<Field label='Orden' htmlFor={`mio-${image.id}`}>
				<input id={`mio-${image.id}`} name='displayOrder' type='number' min={0} defaultValue={image.displayOrder} className={controlClass} />
			</Field>
			<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Guardar</Button>
			<FeedbackMessage result={state} />
		</form>
	);
}

export default function MemberImagesManager({ memberId, images }) {
	return (
		<div className='flex flex-col gap-6'>
			<CreateImageForm memberId={memberId} />
			<ul>
				{images.map((image) => (
					<ChildItem
						key={image.id}
						id={image.id}
						label='esta imagen'
						onDelete={deleteMemberImage}
						summary={
							<>
								<div className='relative size-16 shrink-0 bg-black'>
									<Image src={image.url} alt={image.alt} fill unoptimized sizes='64px' className='object-cover' />
								</div>
								<span className='min-w-0 truncate text-sm'>{image.alt}</span>
								<span className='text-xs text-lightgray'>Orden {image.displayOrder}</span>
							</>
						}
						editForm={<EditImageForm image={image} />}
					/>
				))}
			</ul>
		</div>
	);
}
