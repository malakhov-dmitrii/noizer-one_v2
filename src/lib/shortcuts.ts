import { playback, playRandom, stop } from '@/stores/playback';
import { get } from 'svelte/store';

const shortcuts = [
	{
		keys: ['m'],
		title: 'Mute/Unmute',
		callback: () => {
			const pb = get(playback);
			Howler.mute(!pb.muted);
			playback.set({
				...pb,
				muted: !pb.muted
			});
			// logEvent(analytics, playerStore.muted ? 'kbd_unmute' : 'kbd_mute');
		}
	},
	{
		keys: ['+'],
		title: 'Volume Up',
		callback: () => {
			// Update the store and the Howler volume
			playback.update((pb) => {
				const volume = +(pb.volume + 0.1).toFixed(2);

				if (volume > 1) return pb;

				Howler.volume(volume);
				return {
					...pb,
					volume
				};
			});

			// logEvent(analytics, 'kbd_volume_up');
		}
	},
	{
		keys: ['-'],
		title: 'Volume Down',
		callback: () => {
			// Update the store and the Howler volume
			playback.update((pb) => {
				const volume = +(pb.volume - 0.1).toFixed(2);

				if (volume < 0) return pb;

				Howler.volume(volume);
				return {
					...pb,
					volume
				};
			});
			// logEvent(analytics, 'kbd_volume_down');
		}
	},
	{
		keys: ['s'],
		title: 'Stop All',
		callback: () => {
			stop();
			// logEvent(analytics, 'kbd_stop_all');
		}
	},
	{
		keys: ['r'],
		title: 'Play random set',
		callback: () => {
			playRandom();
			// logEvent(analytics, 'kbd_play_random');
		}
	}
];

export default shortcuts;
