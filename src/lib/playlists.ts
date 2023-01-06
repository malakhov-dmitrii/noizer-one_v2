export interface PlaylistItem {
	group: string;
	title: string;
	uid: string;
	sounds: {
		path: string;
		volume: number;
	}[];
}

const playlists: PlaylistItem[] = [
	{
		group: 'Focus',
		title: 'Cafe work',
		uid: 'initial1',
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
		uid: 'initial12',
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
		uid: 'initial13',
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
