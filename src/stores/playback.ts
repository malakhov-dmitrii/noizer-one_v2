import { get, writable } from 'svelte/store';
import { Howl, Howler } from 'howler';
import sounds from '@/lib/sounds';
import { listSounds } from '@/lib/utils';
import { random } from 'lodash';
import type { PlaylistItem } from '@/lib/playlists';

export const randomSlice = <T>(arr: T[], n: number): T[] =>
	[...arr].sort(() => Math.random() - Math.random()).slice(0, n);

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

	/**
	 * If a playlist is active, reset it, but dont interrupt the sound that is playing
	 */
	const activePlaylist = get(playback).playlist;
	if (activePlaylist) playback.set({ ...get(playback), playlist: null });

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
};

export const stop = () => {
	Howler.stop();
	selectedVariantPerSound.set({});
};

export const playRandom = () => {
	const location = randomSlice(
		sounds.filter((i) => i.group === 'Locations'),
		1
	)[0].path;
	const bg = randomSlice(
		sounds.filter((i) => i.group === 'Background'),
		random(1, 2, false)
	).map((i) => i.path);
	const tweak = randomSlice(
		sounds.filter((i) => i.group === 'Tweak'),
		1
	)[0].path;

	stop();
	for (const path of [location, ...bg, tweak]) {
		toggleSound(path);
	}
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

export const playPlaylist = (playlist: PlaylistItem) => {
	stop();
	for (const item of playlist.sounds) toggleSound(item.path);
};
