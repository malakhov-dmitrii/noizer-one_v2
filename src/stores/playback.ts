import { get, writable, type Unsubscriber } from 'svelte/store';
import { Howl, Howler } from 'howler';
import sounds from '@/lib/sounds';
import _ from 'lodash';
import type { PlaylistSound } from '@/lib/playlists';
import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
import type { Playlist } from '@prisma/client';
import { goto } from '$app/navigation';
import { tweened, type Tweened } from 'svelte/motion';
import { cubicInOut } from 'svelte/easing';
// import mixpanel from 'mixpanel-browser';

export const randomSlice = <T>(arr: T[], n: number): T[] =>
	[...arr].sort(() => Math.random() - Math.random()).slice(0, n);

const parseSoundPath = (path: string): Omit<FileItem, 'free'> => {
	const [, , group, soundWithIcon, variantName] = path.split('/');

	return {
		group,
		sound: soundWithIcon.split('_')[0],
		variantName,
		path
	};
};

Howler.autoUnlock = true;

export interface FileItem {
	group: string;
	icon?: string;
	path: string;
	sound: string;
	variantName: string;
	free: boolean;
}

// const osc = new OscillatorNode();

export type GroupedSounds = Record<string, Record<string, FileItem[]>>;

export interface SoundVariant {
	name: string;
	variants: [];
	activeVariantIdx: number;
}

export const toggleSound = (path: string, play?: boolean) => {
	stopAllTweens();
	// find item in sounds list
	// if its playing, stop it
	// if its not playing, load it and play it
	const activeVariant = get(selectedVariantPerSound)[path];

	const sv = get(selectedVariantPerSound);
	const soundFromSameSoundGroup = _.keys(sv).find(
		(key) => parseSoundPath(key).sound === parseSoundPath(path).sound
	);
	soundFromSameSoundGroup && stopSound(soundFromSameSoundGroup);

	const onboarding = get(onboardingStep);
	if (onboarding === 0 || onboarding === 1) incrementOnboardingStep();

	/**
	 * If a playlist is active, reset it, but dont interrupt the sound that is playing
	 */
	const activePlaylist = get(playback).playlist;
	if (activePlaylist) {
		playback.set({ ...get(playback), playlist: null });
		goto('/');
	}

	/**
	 * Here we want to play the sound
	 */
	if (!activeVariant || activeVariant.error || play) {
		selectedVariantPerSound.update((state) => {
			state[path] = {
				error: false,
				loading: true,
				howler: undefined
			};
			return state;
		});

		const howl = new Howl({
			loop: true,
			src: [`${path}_${320}.m4a`],
			autoplay: true,
			volume: 0.5
		});

		/**
		 * If sound was already loaded, just play it
		 */
		howl.on('play', () => {
			selectedVariantPerSound.update((state) => {
				state[path] = {
					loading: false,
					howler: howl,
					error: false,
					volumeTween: tweened(50, {
						duration: 10000,
						easing: cubicInOut
					})
				};
				return state;
			});
		});

		/**
		 * When the sound is loaded, play it and update the state
		 */
		howl.on('load', () => {
			selectedVariantPerSound.update((state) => {
				state[path] = {
					loading: false,
					howler: howl,
					error: false,
					volumeTween: tweened(50, {
						duration: 10000,
						easing: cubicInOut
					})
				};
				return state;
			});
		});

		/**
		 * When the sound fails to load, update the state
		 */
		howl.on('loaderror', () => {
			selectedVariantPerSound.update((state) => {
				state[path] = {
					error: true,
					loading: false,
					howler: undefined
				};
				return state;
			});
		});

		/**
		 * When the sound is stopped, update the state, and unload the sound
		 */
	} else {
		activeVariant.howler?.stop();
		selectedVariantPerSound.update((state) => {
			state[path] = undefined;
			return state;
		});
	}

	const sound = sounds.find((i) => i.path === path);
	// mixpanel.track('toggle_sound', {
	// 	sound: sound?.sound,
	// 	variant: sound?.variantName,
	// 	group: sound?.group,
	// 	free: sound?.free
	// });
	// mixpanel.people.increment('toggle_sound');
};

const stopSound = (path: string) => {
	const activeVariant = get(selectedVariantPerSound)[path];
	activeVariant?.howler?.stop();
	if (activeVariant?.volumeTweenUnsubscribe) {
		activeVariant.volumeTweenUnsubscribe();
		activeVariant.volumeTweenUnsubscribe = undefined;
	}
	selectedVariantPerSound.update((state) => {
		state[path] = undefined;
		delete state[path];
		return state;
	});
	playback.set({ ...get(playback), tweenVolume: false });
};

export const stop = () => {
	Howler.stop();

	stopAllTweens();

	selectedVariantPerSound.set({});
	playback.set({ ...get(playback), playlist: null });
	goto('/');

	// mixpanel.track('stop');
};

export const playRandom = () => {
	const location = randomSlice(
		sounds.filter((i) => i.group === 'Locations'),
		1
	)[0].path;
	const bg = randomSlice(
		sounds.filter((i) => i.group === 'Background'),
		_.random(1, 2, false)
	).map((i) => i.path);
	const tweak = randomSlice(
		sounds.filter((i) => i.group === 'Tweak'),
		1
	)[0].path;

	stop();
	for (const path of [location, ...bg, tweak]) {
		toggleSound(path);
	}

	// mixpanel.track('play_random');
};

interface SoundVariantItem {
	howler?: Howl;
	volumeTween?: Tweened<number>;
	volumeTweenUnsubscribe?: Unsubscriber;
	loading: boolean;
	error: boolean;
}

export const selectedVariantPerSound = writable(
	{} as Record<
		string, // sound path
		SoundVariantItem | undefined
	>
);

export const playback = writable({
	muted: false,
	volume: 1,
	tweenVolume: false,
	playlist: null as string | null
});

export const playPlaylist = (playlist: Playlist) => {
	stop();
	for (const item of playlist.sounds as unknown as PlaylistSound[]) toggleSound(item.path);
	playback.set({ ...get(playback), playlist: playlist.id });
	goto('/?playlist=' + playlist.id);
	// mixpanel.track('play_playlist', { playlist: playlist.id });
	// mixpanel.people.increment('playlists_played');
};

const stopAllTweens = () => {
	const playingSounds = Object.values(get(selectedVariantPerSound));
	playingSounds.forEach((i) => {
		if (i) {
			console.log('stopping', i?.volumeTweenUnsubscribe);
			i?.volumeTweenUnsubscribe?.();
			i.volumeTweenUnsubscribe = undefined;
		}
	});

	playback.set({ ...get(playback), tweenVolume: false });
};

const tweenVolume = (item: SoundVariantItem) => {
	const targetValue = _.random(15, 100, false);
	console.log('tweening', targetValue);
	item.volumeTween?.set(targetValue);
	const unsub = item.volumeTween?.subscribe((value) => {
		console.log(value);

		item?.howler?.volume(value / 100);
		if (value === targetValue) {
			unsub?.();
			tweenVolume(item);
		}
	});
	return unsub;
};

export const toggleTweenVolume = () => {
	const state = get(playback);
	playback.set({ ...state, tweenVolume: !state.tweenVolume });

	const playingSounds = Object.values(get(selectedVariantPerSound)).filter((i) =>
		i?.howler?.playing()
	);
	if (!state.tweenVolume) {
		const unsubs = playingSounds.filter(Boolean).map((i) => tweenVolume(i!));
		playingSounds.forEach((i, index) => {
			i!.volumeTweenUnsubscribe = unsubs[index];
		});
	} else {
		playingSounds.forEach((i) => {
			i!.volumeTweenUnsubscribe?.();
			i!.volumeTweenUnsubscribe = undefined;
			i!.howler?.volume(0.5);
		});
	}
};
