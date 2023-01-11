// export interface PlaylistItem {
// 	group: string;
// 	title: string;
// 	uid: string;
// 	sounds: {
// 		path: string;
// 		volume: number;
// 	}[];
// }

import type { Playlist } from '@prisma/client';

export interface PlaylistSound {
	path: string;
	volume: number;
}

const playlists: Pick<Playlist, 'group' | 'id' | 'sounds' | 'title'>[] = [
	{
		group: 'Focus',
		title: 'Cafe work',
		id: 'initial1',
		sounds: [
			{
				path: '/audio/Locations/Cafe_fa-mug-saucer/Cafe (English speech)',
				volume: 0.5
			},
			{
				path: '/audio/Tweak/Keyboard_fa-keyboard/Keyboard',
				volume: 0.5
			},
			{
				path: '/audio/Background/Thunder_fa-bolt/Thunderstorm with rain',
				volume: 0.5
			}
		]
	},
	{
		group: 'Focus',
		title: 'Cafe on the stormed beach',
		id: 'initial12',
		sounds: [
			{
				path: '/audio/Locations/Cafe_fa-mug-saucer/Cafe (English speech)',
				volume: 0.5
			},
			{
				path: '/audio/Background/Waves_fa-water/Beach',
				volume: 0.5
			},
			{
				path: '/audio/Background/Thunder_fa-bolt/Thunderstorm with rain',
				volume: 0.5
			}
		]
	},
	{
		group: 'Relax',
		title: 'Forest campfire',
		id: 'initial13',
		sounds: [
			{
				path: '/audio/Background/Bonfire_fa-fire/Bonfire 1',
				volume: 0.5
			},
			{
				path: '/audio/Background/Forest_fa-tree/Forest 5',
				volume: 0.5
			}
		]
	}
];

export default playlists;
