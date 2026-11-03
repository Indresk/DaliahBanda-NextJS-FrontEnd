import { requirePageRole } from '@/back/utils/sessionGuard';
import ArticlesService from '@/back/services/articles.service';
import MembersService from '@/back/services/members.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import ArticleForm from '../_components/ArticleForm';

export const metadata = { title: 'Nuevo artículo' };

export default async function NewArticlePage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const [members, tagSuggestions] = await Promise.all([
		MembersService.findAll(),
		ArticlesService.listTagNames(),
	]);

	return (
		<Card title='Nuevo artículo'>
			<ArticleForm members={members.map(({ id, name }) => ({ id, name }))} tagSuggestions={tagSuggestions} />
		</Card>
	);
}
