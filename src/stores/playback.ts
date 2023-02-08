import { get, writable } from 'svelte/store';
import { Howl, Howler } from 'howler';
import sounds from '@/lib/sounds';
import _, { keys } from 'lodash';
import type { PlaylistSound } from '@/lib/playlists';
import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
import type { Playlist } from '@prisma/client';
import { goto } from '$app/navigation';
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

export type GroupedSounds = Record<string, Record<string, FileItem[]>>;

export interface SoundVariant {
	name: string;
	variants: [];
	activeVariantIdx: number;
}

export const toggleSound = (path: string, play?: boolean) => {
	// find item in sounds list
	// if its playing, stop it
	// if its not playing, load it and play it
	const activeVariant = get(selectedVariantPerSound)[path];

	const sv = get(selectedVariantPerSound);
	const soundFromSameSoundGroup = keys(sv).find(
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
					error: false
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
					error: false
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
	selectedVariantPerSound.update((state) => {
		state[path] = undefined;
		delete state[path];
		return state;
	});
};

export const stop = () => {
	Howler.stop();
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

export const selectedVariantPerSound = writable(
	{} as Record<
		string, // sound path
		| {
				howler?: Howl;
				loading: boolean;
				error: boolean;
		  }
		| undefined
	>
);

export const playback = writable({
	muted: false,
	volume: 1,
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
