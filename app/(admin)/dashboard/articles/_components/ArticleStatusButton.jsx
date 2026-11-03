'use client';

import { useState, useTransition } from 'react';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import { setArticleStatus } from '@/back/actions/articles.actions';
import { ARTICLE_STATUS } from '@/shared/constants';

// Publica un borrador o pasa un artículo publicado a borrador
export default function ArticleStatusButton({ id, status }) {
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();
	const publish = status !== ARTICLE_STATUS.PUBLISHED;

	return (
		<span className='flex flex-col items-start'>
			<button
				type='button'
				disabled={pending}
				onClick={() =>
					startTransition(async () =>
						setResult(await setArticleStatus(id, publish ? ARTICLE_STATUS.PUBLISHED : ARTICLE_STATUS.DRAFT)),
					)
				}
				className='cursor-pointer text-xs underline disabled:opacity-50'>
				{publish ? 'Publicar' : 'Pasar a borrador'}
			</button>
			{result?.status === 'error' && <FeedbackMessage result={result} />}
		</span>
	);
}
