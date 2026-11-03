import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import ArticlesService from '@/back/services/articles.service';
import MembersService from '@/back/services/members.service';
import { deleteArticle } from '@/back/actions/articles.actions';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import DeleteEntityButton from '@/frontend/components/ui/DeleteEntityButton';
import ArticleForm from '../_components/ArticleForm';

export const metadata = { title: 'Editar artículo' };

export default async function EditArticlePage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id } = await params;

	const articleId = Number(id);
	if (!Number.isInteger(articleId) || articleId <= 0) notFound();

	const [article, members, tagSuggestions] = await Promise.all([
		ArticlesService.findByIdWithRelations(articleId),
		MembersService.findAll(),
		ArticlesService.listTagNames(),
	]);
	if (!article) notFound();

	// Las fechas de la fila no se envían al formulario
	const { createdAt, updatedAt, publishedAt, readingMinutes, ...editable } = article;

	return (
		<Card title={article.title}>
			<ArticleForm article={editable} members={members.map(({ id: memberId, name }) => ({ id: memberId, name }))} tagSuggestions={tagSuggestions} />
			<DeleteEntityButton
				id={article.id}
				action={deleteArticle}
				label='Eliminar artículo'
				confirmMessage={`¿Eliminar "${article.title}"? Esta acción no se puede deshacer.`}
				redirectTo='/dashboard/articles'
			/>
		</Card>
	);
}
