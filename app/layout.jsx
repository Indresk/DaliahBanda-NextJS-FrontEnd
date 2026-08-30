import localFont from 'next/font/local';
import './globals.css';
import Header from './_components/global/Header/Header';
import Footer from './_components/global/Footer/Footer';
// import DaliahClicker from './_components/global/DaliahClicker/DaliahClicker';
import AudioPlayer from './_components/global/AudioPlayer/AudioPlayer';

export default function RootLayout({ children }) {
	return (
		<html
			lang='en'
			className={`h-full antialiased ${materialSymbols.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
			<head></head>
			<body className='min-h-full flex flex-col'>
				<div className='grid grid-rows-[auto_1fr_auto] min-h-screen overflow-x-hidden'>
					<Header />
					<main className='w-screen'>{children}</main>
					<Footer />
				</div>
				<AudioPlayer />
				{/* <DaliahClicker /> */}
			</body>
		</html>
	);
}

const materialSymbols = localFont({
	src: '../public/fonts/mso-variable.ttf',
	variable: '--font-material-symbols',
	display: 'swap',
});

const spaceGrotesk = localFont({
	src: '../public/fonts/sg-variable.ttf',
	variable: '--font-headline',
	display: 'swap',
});

const manrope = localFont({
	src: '../public/fonts/mr-variable.ttf',
	variable: '--font-body',
	display: 'swap',
});
