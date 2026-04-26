'use client';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
	getImagesByEvents,
	getImagesByIntegrantes,
	getBackstageImages,
} from '../../../services/firebase';
import Image from 'next/image';

export default function FilterView() {
	const { filter } = useParams();
	const location = useLocation();
	const navigation = useNavigate();
	const [assets, setAssets] = useState([]);
	const [noAssetsFlag, setNoAssetsFlag] = useState(false);
	const [loading, setLoading] = useState(true);
	let searchFlag = 'members';

	async function handleShare(link) {
		await navigator.clipboard.writeText(link);
	}

	function noAssets() {
		setNoAssetsFlag(true);
		setTimeout(() => {
			navigation(-1);
		}, 5000);
	}

	async function fetchImages(imageSeter) {
		const fetchedimages = await imageSeter([filter]);
		const filteredAssets = fetchedimages.filter((e) => e.active);
		if (filteredAssets.length === 0) {
			noAssets();
			return;
		}
		setAssets(filteredAssets);
		setLoading(false);
	}

	useEffect(() => {
		setLoading(true);
		setNoAssetsFlag(false);
		if (location.pathname.includes('gallery/event')) {
			searchFlag = 'event';
		}
		if (location.pathname.includes('gallery/backstage')) {
			searchFlag = 'backstage';
		}

		switch (searchFlag) {
			case 'event':
				fetchImages(getImagesByEvents);
				break;
			case 'backstage':
				fetchImages(getBackstageImages);
				break;
			default:
				fetchImages(getImagesByIntegrantes);
				break;
		}
	}, [filter]);

	if (noAssetsFlag) {
		return (
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<h1>
					No hay assets para tu busqueda...{' '}
					<a className='text-pink-500 underline' href='/' data-discover='true'>
						Click para volver.
					</a>
				</h1>
			</div>
		);
	}

	if (loading) {
		return (
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<h1>
					Cargando...{' '}
					<a className='text-pink-500 underline' href='/' data-discover='true'>
						Click para volver.
					</a>
				</h1>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				{assets.map((assetInfo) => (
					<div key={assetInfo.id}>
						<Image
							width={assetInfo.width}
							height={assetInfo.height}
							className='h-50 max-w-full rounded-base'
							src={assetInfo.url}
							alt={assetInfo.alt}
						/>
						<span
							onClick={() => handleShare(assetInfo.url)}
							className='material-symbols-outlined mt-2 inline-block cursor-pointer transition-transform hover:scale-110 h-6'>
							share
						</span>{' '}
					</div>
				))}
			</div>
		</div>
	);
}
