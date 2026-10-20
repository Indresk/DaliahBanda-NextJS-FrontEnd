import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActiveMembers, getMember } from '@/back/services/members.cache';
import { MEMBER_LINK_KINDS } from '@/shared/constants';
import { memberImageAlt } from '@/shared/utils/members';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { memberMeta } from '@/frontend/seo/pages/about.meta';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { buildPersonSchema } from '@/frontend/seo/schema/person';
import { aboutCrumbs } from '../../_lib/breadcrumbs';

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const member = await getMember(slug);

	return member ? buildMetadata(memberMeta(member)) : {};
}

const LINK_GROUPS = [
	{ kind: MEMBER_LINK_KINDS.CONTACT, title: 'Contacto' },
	{ kind: MEMBER_LINK_KINDS.PROJECT, title: 'Otros proyectos' },
];

export default async function MemberPage({ params }) {
	const { slug } = await params;
	const [member, members] = await Promise.all([getMember(slug), getActiveMembers()]);
	if (!member) notFound();

	const others = members.filter((item) => item.id !== member.id);
	const linkGroups = LINK_GROUPS.map((group) => ({
		...group,
		links: member.links.filter((link) => link.kind === group.kind),
	})).filter((group) => group.links.length);

	return (
		<article className='flex flex-col gap-14 px-8 py-14 md:px-14'>
			<JsonLd data={buildPersonSchema(member)} />
			<JsonLd data={buildBreadcrumbSchema(aboutCrumbs({ member }))} />

			<header className='flex flex-col gap-8 md:flex-row'>
				<div className='flex basis-[40%] flex-col justify-center gap-4 order-2 md:order-1'>
					<div>
						<h1 className='font-headline text-4xl font-bold uppercase tracking-tighter md:text-6xl'>
							{member.name}
						</h1>
						<h2 className='font-headline text-sm uppercase tracking-tighter text-lightgray'>
							{member.instrument}
						</h2>
					</div>
					<p className='whitespace-pre-line'>{member.longBio || member.shortBio}</p>
					{linkGroups.map((group) => (
						<section key={group.kind}>
							<h3 className='font-bold'>{group.title}</h3>
							<ul className='flex flex-wrap gap-x-6 gap-y-1 text-sm'>
								{group.links.map((link) => (
									<li key={link.url}>
										<a href={link.url} target='_blank' rel='noopener noreferrer' className='underline hover:text-primary-light'>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
				<div className='basis-[60%] order-1 md:order-2'>
					<Image
						width={member.featuredWidth}
						height={member.featuredHeight}
						sizes='(min-width: 768px) 60vw, 100vw'
						src={member.featuredUrl}
						alt={memberImageAlt(member)}
						priority
					/>
				</div>
			</header>

			{member.images.length > 0 && (
				<section className='flex flex-col gap-4'>
					<h2 className='font-headline text-2xl font-bold uppercase tracking-tighter'>Más de {member.name.replace(/"/g, '')}</h2>
					<ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{member.images.map((image) => (
							<li key={image.id}>
								<Image
									width={image.width}
									height={image.height}
									sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
									src={image.url}
									alt={image.alt}
									className='aspect-video w-full object-cover'
								/>
							</li>
						))}
					</ul>
				</section>
			)}

			{others.length > 0 && (
				<nav aria-label='Otros integrantes' className='flex flex-col gap-4 bg-darkgray p-6'>
					<h2 className='font-bold'>Conoce al resto de la banda</h2>
					<ul className='flex flex-wrap gap-x-6 gap-y-2'>
						{others.map((item) => (
							<li key={item.id}>
								<Link href={`/about-us/members/${item.slug}`} className='hover:text-primary-light hover:underline'>
									{item.name.replace(/"/g, '')}
								</Link>
							</li>
						))}
					</ul>
					<Link href='/about-us/members' className='text-sm text-primary-light hover:underline'>
						Ver la formación completa y su historia
					</Link>
				</nav>
			)}
		</article>
	);
}
