<script lang="ts">
	import { Button, Hr } from 'flowbite-svelte';
	import _ from 'lodash';
	import { listSounds } from '$lib/utils';
	import sounds from '$lib/sounds';
	import SoundCard from '@/components/SoundCard.svelte';
	import Playlists from '@/components/Playlists.svelte';
	import { onMount } from 'svelte';
	import shortcuts from '@/lib/shortcuts';
	import Mousetrap from 'mousetrap';
	import playlists from '@/lib/playlists';
	import { playPlaylist } from '@/stores/playback';
	import Onboarding from '@/components/Onboarding.svelte';
	import ShortcutsGuide from '@/components/ShortcutsGuide.svelte';
	import { page } from '$app/stores';
	import ExploreSection from '@/components/ExploreSection.svelte';
	import soundsOrder from '@/lib/soundsOrder';
	// import mixpanel from 'mixpanel-browser';

	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const soundsEntries = _.entries(
		_.pick(listSounds(sounds), 'Locations', 'Background', 'Tweak', 'Color noise', 'Others', 'ASMR')
	);

	onMount(() => {
		// mixpanel.init('8a8df07ff26685036e0f8571414fa894', { debug: true });
		const list = [...playlists, ...$page.data.playlists];

		for (const item of shortcuts) {
			Mousetrap.bind(`${item.keys.join('+')}`, item.callback);
		}
		Mousetrap.bind(['1', '2', '3', '4', '5', '6', '7', '8', '9'], (e: KeyboardEvent) => {
			if (+e.key <= list.length) {
				const selectedListItem = list[+e.key - 1];
				playPlaylist(selectedListItem);
			}
		});

		const initialPlaylistId = $page.url.searchParams.get('playlist');
		const initialPlaylist = list.find((playlist) => playlist.id === initialPlaylistId);

		if (initialPlaylist) {
			playPlaylist(initialPlaylist);
		}
	});
</script>

<main class="flex flex-col justify-center min-h-screen">
	<div class="relative w-full max-w-4xl px-4 pb-24 m-auto lg:px-0">
		<Onboarding />

		<div class="absolute hidden w-56 px-4 py-2 rounded-md -right-64 top-12 xl:block">
			<ShortcutsGuide />
		</div>

		<ExploreSection />

		<div class="mt-4">
			<Playlists />
		</div>

		<Hr />

		{#each soundsEntries as [group, items]}
			{@const sounds = _.entries(items)}
			<!-- {console.log({ group, sounds })} -->
			<div>
				<h2 class="mt-8 mb-4 text-3xl font-medium">{group}</h2>

				<div
					class="grid w-full grid-flow-row grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-x-6 gap-y-6"
				>
					{#each _.sortBy(sounds, ([title]) => soundsOrder[title] ?? 10) as [title, variants]}
						<SoundCard {title} {variants} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>
