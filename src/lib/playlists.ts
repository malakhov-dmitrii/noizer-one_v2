// export interface PlaylistItem {
// 	group: string;
// 	title: string;
// 	uid: string;
// 	sounds: {
// 		path: string;
// 		volume: number;
// 	}[];
// }

import type { Database } from '@/lib/database.types';

export interface PlaylistSound {
	path: string;
	volume: number;
}

export type Playlist = Database['public']['Tables']['playlists']['Row'];

const initialPlaylists: Playlist[] = [
	{
		group: 'Focus',
		title: 'Cafe work',
		id: -1,
		user_id: 'admin',
		created_at: '2021-08-01T00:00:00.000Z',
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
		id: -2,
		user_id: 'admin',
		created_at: '2021-08-01T00:00:00.000Z',
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
		id: -3,
		created_at: '2021-08-01T00:00:00.000Z',
		user_id: 'admin',
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

export default initialPlaylists;
