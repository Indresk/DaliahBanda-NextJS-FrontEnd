import type { Metadata } from 'next';

// import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import Header from './_components/global/Header/Header';
import Footer from './_components/global/Footer/Footer';
import DaliahClicker from './_components/global/DaliahClicker/DaliahClicker';
import AudioPlayer from './_components/global/AudioPlayer/AudioPlayer';

// const geistSans = Geist({
// 	variable: '--font-geist-sans',
// 	subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
// 	variable: '--font-geist-mono',
// 	subsets: ['latin'],
// });

export const metadata: Metadata = {
	title: 'Daliah Banda | Metalcore · Pop Emo Punk desde Bogotá',
	description:
		'Daliah es una banda de metalcore y pop emo punk formada en Bogotá. Su sonido mezcla punk rock, pop-punk y metal progresivo con letras sociales, emocionales y políticas.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			// className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			className={`h-full antialiased`}>
			<head>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
				/>
			</head>
			<body className='min-h-full flex flex-col'>
				<div className='grid grid-rows-[auto_1fr_auto] min-h-screen overflow-x-hidden'>
					<Header />
					<main className='w-[100vw]'>{children}</main>
					<Footer />
				</div>
				<AudioPlayer />
				<DaliahClicker />
			</body>
		</html>
	);
}
