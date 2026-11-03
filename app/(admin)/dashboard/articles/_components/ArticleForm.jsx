'use client';

import { useState } from 'react';
import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import TextEditor from '@/frontend/components/inputs/TextEditor/TextEditorLoader';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { createArticle, updateArticle } from '@/back/actions/articles.actions';
import { ARTICLE_STATUS, ARTICLE_STATUS_LABELS } from '@/shared/constants';
import { articlePath } from '@/shared/utils/articles';
import AuthorsField from './AuthorsField';
import ImageRatioPreview from './ImageRatioPreview';
import TagsField from './TagsField';

const IMAGE_NAMES = { url: 'imageUrl', width: 'imageWidth', height: 'imageHeight' };

// Fecha de hoy en la zona horaria del navegador (AAAA-MM-DD)
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Alta y edición de un artículo. En edición el slug no cambia (forma la URL pública).
export default function ArticleForm({ article, members, tagSuggestions }) {
	const isEdit = Boolean(article);
	const { state, pending, handleSubmit } = useFormAction(isEdit ? updateArticle : createArticle);
	const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? '');

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			{isEdit && <input type='hidden' name='id' value={article.id} />}

			<div className='flex flex-col gap-4'>
				<ImageUrlFields
					idPrefix='a'
					names={IMAGE_NAMES}
					urlLabel='Imagen principal (URL)'
					urlHint='Sirve de masthead y de miniatura. Cópiala desde Assets.'
					initial={{ url: article?.imageUrl, width: article?.imageWidth, height: article?.imageHeight }}
					onUrlChange={setImageUrl}
				/>
				<Field label='Texto alternativo de la imagen' htmlFor='a-alt' hint='Describe la imagen: accesibilidad y buscadores.'>
					<input id='a-alt' name='imageAlt' required maxLength={300} defaultValue={article?.imageAlt ?? ''} className={controlClass} />
				</Field>
				<ImageRatioPreview url={imageUrl} />
			</div>

			<div className='flex flex-col gap-4'>
				<Field label='Título' htmlFor='a-title' hint='Título del artículo, de la página en el navegador y del masthead.'>
					<input id='a-title' name='title' required maxLength={160} defaultValue={article?.title ?? ''} className={controlClass} />
				</Field>
				{!isEdit && (
					<Field label='Identificador (slug, no se puede cambiar)' htmlFor='a-slug' hint='Forma la URL: /manifiestos/<slug>'>
						<input id='a-slug' name='slug' required maxLength={80} pattern='[a-z0-9]+(-[a-z0-9]+)*' className={controlClass} />
					</Field>
				)}
				<Field label='Sinopsis' htmlFor='a-synopsis' hint='Descripción del artículo: buscadores, redes sociales y listas. Ideal: hasta 160 caracteres (máx. 400).'>
					<textarea id='a-synopsis' name='synopsis' rows={3} required maxLength={400} defaultValue={article?.synopsis ?? ''} className={controlClass} />
				</Field>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Fecha que se muestra' htmlFor='a-date' hint='Editable. No cambia el orden de publicación.'>
						<input id='a-date' name='displayDate' type='date' required defaultValue={article?.displayDate ?? today()} className={controlClass} />
					</Field>
					<Field label='Estado' htmlFor='a-status' hint='Un borrador no se ve en el sitio.'>
						<select id='a-status' name='status' defaultValue={article?.status ?? ARTICLE_STATUS.DRAFT} className={controlClass}>
							{Object.entries(ARTICLE_STATUS_LABELS).map(([value, label]) => (
								<option key={value} value={value}>{label}</option>
							))}
						</select>
					</Field>
				</div>
				<TagsField defaultValue={article?.tags ?? []} suggestions={tagSuggestions} />
				<AuthorsField defaultValue={article?.authors ?? []} members={members} />
			</div>

			<div className='flex flex-col gap-4 lg:col-span-2'>
				<Field label='Contenido' hint='Texto enriquecido: títulos, listas, enlaces, imágenes (por URL, con su texto alternativo) y videos o iframes. Obligatorio para publicar.'>
					<TextEditor name='content' defaultValue={article?.content ?? ''} />
				</Field>
				<div className='flex flex-wrap items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
						{isEdit ? 'Guardar cambios' : 'Crear artículo'}
					</Button>
					<Link href='/dashboard/articles' className='text-sm underline'>Volver a la lista</Link>
					{isEdit && article.status === ARTICLE_STATUS.PUBLISHED && (
						<Link href={articlePath(article.slug)} target='_blank' className='text-sm underline'>Ver en el sitio</Link>
					)}
				</div>
				<FeedbackMessage result={state} />
				{!isEdit && state?.status === 'success' && (
					<Link href={`/dashboard/articles/${state.payload.id}`} className='text-sm underline'>
						Seguir editando el artículo
					</Link>
				)}
			</div>
		</form>
	);
}
