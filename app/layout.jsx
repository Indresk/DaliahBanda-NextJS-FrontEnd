import localFont from 'next/font/local';
import './globals.css';
import Header from './_components/global/Header/Header';
import Footer from './_components/global/Footer/Footer';
// import DaliahClicker from './_components/global/DaliahClicker/DaliahClicker';
import AudioPlayer from './_components/global/AudioPlayer/AudioPlayer';
import LiveStatusRefresher from './_components/global/LiveStatusRefresher';
import PreferencesHydrator from '../src/frontend/providers/PreferencesHydrator';
import { rootMetadata } from '@/frontend/seo/buildMetadata';

export const metadata = rootMetadata;

export default function RootLayout({ children }) {
	return (
		<html
			lang='es'
			className={`h-full antialiased ${materialSymbols.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
			<head></head>
			<body className='min-h-dvh flex flex-col'>
				<div className='grid grid-rows-[auto_1fr_auto] min-h-dvh overflow-x-clip'>
					<Header />
					<main className='w-dvw'>{children}</main>
					<Footer />
				</div>
				<PreferencesHydrator />
				<LiveStatusRefresher />
				<AudioPlayer />
				{/* <DaliahClicker /> */}
			</body>
		</html>
	);
}

const materialSymbols = localFont({
	src: '../public/fonts/mso-variable.woff2',
	variable: '--font-material-symbols',
	display: 'block',
});

const spaceGrotesk = localFont({
	src: '../public/fonts/sg-variable.woff2',
	variable: '--font-headline',
	display: 'swap',
});

const manrope = localFont({
	src: '../public/fonts/mr-variable.woff2',
	variable: '--font-body',
	display: 'swap',
});
