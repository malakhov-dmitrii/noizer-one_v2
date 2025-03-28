import { playback, playRandom, stop } from '@/stores/playback';
import { get } from 'svelte/store';
import * as amplitude from '@amplitude/analytics-browser';
import posthog from 'posthog-js';
// import mixpanel from 'mixpanel-browser';

const shortcuts = [
	{
		keys: ['m', 'space'],
		title: 'Mute/Unmute',
		callback: (e) => {
			e.preventDefault();
			amplitude.track('kbd_toggle_mute');
			posthog.capture('kbd_toggle_mute');
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
				amplitude.track('kbd_volume_up');
				posthog.capture('kbd_volume_up');
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

				amplitude.track('kbd_volume_down');
				posthog.capture('kbd_volume_down');
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
			amplitude.track('kbd_stop');
			posthog.capture('kbd_stop');
			// mixpanel.track('kbd_stop');
		}
	},
	{
		keys: ['r'],
		title: 'Play random set',
		callback: () => {
			playRandom();
			amplitude.track('kbd_play_random');
			posthog.capture('kbd_play_random');
			// mixpanel.track('kbd_play_random');
		}
	}
];

export default shortcuts;
