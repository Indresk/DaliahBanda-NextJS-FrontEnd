import Link from 'next/link';
import { getActiveMembers, getLineupTimeline } from '@/back/services/members.cache';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { membersMeta } from '@/frontend/seo/pages/about.meta';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { aboutCrumbs } from '../_lib/breadcrumbs';
import LineupTimeline from '../_components/LineupTimeline';
import MemberCard from '../_components/MemberCard';

export async function generateMetadata() {
	return buildMetadata(membersMeta(await getActiveMembers()));
}

export default async function Members() {
	const [members, timeline] = await Promise.all([getActiveMembers(), getLineupTimeline()]);

	return (
		<div className='flex flex-col gap-14 px-8 py-14 md:px-14'>
			<JsonLd data={buildBreadcrumbSchema(aboutCrumbs({ members: true }))} />

			<section className='flex flex-col gap-8'>
				<div>
					<h1 className='font-headline text-4xl font-bold uppercase tracking-tighter md:text-6xl'>
						<span className='text-primary-light'>Integrantes</span> de la banda
					</h1>
					<h2 className='font-headline text-sm uppercase tracking-tighter text-lightgray'>
						Formación actual
					</h2>
				</div>
				{members.length > 0 ? (
					<ul className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
						{members.map((member) => (
							<li key={member.id}>
								<MemberCard member={member} />
							</li>
						))}
					</ul>
				) : (
					<p className='text-lightgray'>Pronto conocerás a la banda.</p>
				)}
			</section>

			{timeline.length > 0 && (
				<section className='flex flex-col gap-8'>
					<div>
						<h2 className='font-headline text-3xl font-bold uppercase tracking-tighter md:text-5xl'>
							Historia de la <span className='text-primary-light'>formación</span>
						</h2>
						<p className='text-sm text-lightgray'>
							Quienes han pasado por Daliah desde 2018, actuales y anteriores.
						</p>
					</div>
					<LineupTimeline entries={timeline} />
				</section>
			)}

			<Link href='/about-us' className='text-sm text-primary-light hover:underline'>
				← Sobre nosotros
			</Link>
		</div>
	);
}
