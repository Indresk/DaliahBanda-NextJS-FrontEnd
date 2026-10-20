import Image from 'next/image';
import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import AssetsService from '@/back/services/assets.service';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';
import { formatFileSize } from '@/shared/utils/format';
import UploadAssetsForm from '../_components/UploadAssetsForm';
import AssetActions from '../_components/AssetActions';
import { buildBreadcrumb, folderHref } from './_lib/paths';

export const metadata = { title: 'Assets' };

export default async function AssetsPage({ searchParams }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { prefix: rawPrefix = '', token } = await searchParams;

	let listing = null;
	let errorMessage = null;
	try {
		listing = await AssetsService.list(rawPrefix, token);
	} catch (error) {
		errorMessage = error.message;
	}

	const prefix = listing?.prefix ?? '';
	const breadcrumb = buildBreadcrumb(prefix);

	return (
		<>
			<PageTitle
				title='Assets'
				description='Archivos del bucket de Cloudflare R2 (assets.daliahbanda.com).'
			/>

			<nav aria-label='Ruta' className='mb-6 flex flex-wrap items-center gap-2 text-sm'>
				<Link href={folderHref('')} className='underline'>
					raíz
				</Link>
				{breadcrumb.map((item) => (
					<span key={item.prefix} className='flex items-center gap-2'>
						<span className='text-lightgray'>/</span>
						<Link href={folderHref(item.prefix)} className='underline'>
							{item.name}
						</Link>
					</span>
				))}
			</nav>

			<div className='flex flex-col gap-6'>
				{errorMessage ? (
					<Card>
						<p role='alert' className='text-sm text-red-400'>
							{errorMessage}
						</p>
					</Card>
				) : (
					<>
						<Card title='Subir archivos'>
							<UploadAssetsForm prefix={prefix} />
						</Card>

						{listing.folders.length > 0 && (
							<Card title='Carpetas'>
								<ul className='flex flex-wrap gap-3'>
									{listing.folders.map((folder) => (
										<li key={folder.prefix}>
											<Link
												href={folderHref(folder.prefix)}
												className='flex items-center gap-2 bg-black px-3 py-2 text-sm transition-colors hover:text-primary-light'>
												<MSOIcon className='text-xl'>folder</MSOIcon>
												{folder.name}
											</Link>
										</li>
									))}
								</ul>
							</Card>
						)}

						<Card title={`Archivos (${listing.files.length}${listing.nextToken ? '+' : ''})`}>
							{listing.files.length === 0 ? (
								<p className='text-sm text-lightgray'>No hay archivos en esta carpeta.</p>
							) : (
								<ul className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
									{listing.files.map((file) => (
										<li key={file.key} className='flex flex-col gap-2 bg-black p-3'>
											<div className='relative flex aspect-video items-center justify-center overflow-hidden bg-darkgray'>
												{file.isImage ? (
													<Image
														fill
														unoptimized
														sizes='(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 45vw'
														src={file.url}
														alt={file.name}
														className='object-cover'
													/>
												) : (
													<MSOIcon className='text-4xl text-lightgray'>draft</MSOIcon>
												)}
											</div>
											<p className='truncate text-xs' title={file.key}>
												{file.name}
											</p>
											<p className='text-xs text-lightgray'>{formatFileSize(file.size)}</p>
											<AssetActions
												assetKey={file.key}
												url={file.url}
												name={file.name}
											/>
										</li>
									))}
								</ul>
							)}
							{listing.nextToken && (
								<Link
									href={`${folderHref(prefix)}${prefix ? '&' : '?'}token=${encodeURIComponent(listing.nextToken)}`}
									className='mt-4 inline-block text-sm underline'>
									Ver más
								</Link>
							)}
						</Card>
					</>
				)}
			</div>
		</>
	);
}
