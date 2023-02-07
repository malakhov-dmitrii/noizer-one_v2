import { playback, playRandom, stop } from '@/stores/playback';
import { get } from 'svelte/store';
// import mixpanel from 'mixpanel-browser';

const shortcuts = [
	{
		keys: ['m', 'space'],
		title: 'Mute/Unmute',
		callback: (e) => {
			e.preventDefault();
			const pb = get(playback);
			Howler.mute(!pb.muted);
			playback.set({
				...pb,
				muted: !pb.muted
			});
			// mixpanel.track('kbd_toggle_mute');
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
			// mixpanel.track('kbd_volume_up');
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
			// mixpanel.track('kbd_volume_down');
		}
	},
	{
		keys: ['s'],
		title: 'Stop All',
		callback: () => {
			stop();
			// mixpanel.track('kbd_stop');
		}
	},
	{
		keys: ['r'],
		title: 'Play random set',
		callback: () => {
			playRandom();
			// mixpanel.track('kbd_play_random');
		}
	}
];

export default shortcuts;
