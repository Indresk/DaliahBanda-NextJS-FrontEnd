import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import MembersService from '@/back/services/members.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import DeleteEntityButton from '@/frontend/components/ui/DeleteEntityButton';
import { deleteMember } from '@/back/actions/members.actions';
import DeactivateMemberForm from '../_components/DeactivateMemberForm';
import MemberForm from '../_components/MemberForm';
import MemberImagesManager from '../_components/MemberImagesManager';
import MemberLinksManager from '../_components/MemberLinksManager';

export const metadata = { title: 'Editar miembro' };

export default async function EditMemberPage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id } = await params;

	const memberId = Number(id);
	if (!Number.isInteger(memberId) || memberId <= 0) notFound();

	const member = await MembersService.findByIdWithRelations(memberId);
	if (!member) notFound();

	// Las fechas de la fila y las relaciones no se envían al formulario principal
	const { links, images, createdAt, updatedAt, ...editable } = member;

	return (
		<div className='flex flex-col gap-6'>
			<Card title={member.name}>
				<MemberForm member={editable} />
				{member.active && (
					<DeactivateMemberForm member={{ id: member.id, name: member.name }} />
				)}
				<DeleteEntityButton
					id={member.id}
					action={deleteMember}
					label='Eliminar miembro'
					confirmMessage={`¿Eliminar a "${member.name}", con sus enlaces e imágenes de apoyo?`}
					redirectTo='/dashboard/members'
				/>
			</Card>
			<Card title={`Enlaces (${links.length})`}>
				<MemberLinksManager memberId={member.id} links={links} />
			</Card>
			<Card title={`Imágenes de apoyo (${images.length})`}>
				<MemberImagesManager memberId={member.id} images={images} />
			</Card>
		</div>
	);
}
