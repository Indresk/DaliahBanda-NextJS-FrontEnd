export type Track = {
	id: string;
	title: string;
	artist: string;
	src: string;
	cover?: string;
};

export const tracks: Track[] = [
	{
		id: 'track-1',
		title: 'Acoustic Breeze',
		artist: 'Benjamin Tissot',
		src: '/track-1.mp3',
		cover:
			'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
	},
	{
		id: 'track-2',
		title: 'Creative Minds',
		artist: 'Benjamin Tissot',
		src: '/track-2.mp3',
		cover:
			'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
	},
];
