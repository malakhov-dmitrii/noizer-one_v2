<script lang="ts">
	import { Hr } from 'flowbite-svelte';
	import { entries, pick } from 'lodash';
	import { listSounds } from '$lib/utils';
	import sounds from '$lib/sounds';
	import SoundCard from '@/components/SoundCard.svelte';
	import Playlists from '@/components/Playlists.svelte';

	const soundsEntries = entries(
		pick(listSounds(sounds), 'Locations', 'Background', 'Tweak', 'Color noise', 'Others', 'ASMR')
	);
</script>

<svelte:head>
	<title>Noizer One</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<main class="flex flex-col justify-center min-h-screen">
	<div class="relative w-full max-w-4xl px-4 m-auto lg:px-0">
		<div class="mt-4">
			<Playlists />
		</div>

		<Hr />

		{#each soundsEntries as [group, items]}
			{@const sounds = entries(items)}
			<div>
				<h2 class="mt-8 mb-4 text-3xl font-medium">{group}</h2>

				<div
					class="grid w-full grid-flow-row grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-x-3 gap-y-3"
				>
					{#each sounds as [title, variants]}
						<SoundCard {title} {variants} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>
