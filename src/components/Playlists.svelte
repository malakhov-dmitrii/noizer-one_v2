<script lang="ts">
	import playlists from '@/lib/playlists';
	import { playback, playPlaylist, stop } from '@/stores/playback';
	import { Kbd, P } from 'flowbite-svelte';
</script>

<h2 class="mt-10 text-2xl font-medium">Playlists</h2>
<div class="flex items-center gap-2 text-sm text-gray-600">
	<p>Use keyboard numbers for quick select: from</p>

	<Kbd class="px-2 py-1">1</Kbd>
	<p>to</p>
	<Kbd class="px-2 py-1">9</Kbd>
</div>

<div class="flex gap-4 px-1 pt-2 pb-3 -mx-1 overflow-x-auto overflow-y-visible flex-nowrap">
	{#each playlists as playlist}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative group"
			on:click={() => {
				playPlaylist(playlist);
				playback.update((state) => {
					return {
						...state,
						playlist: playlist.uid
					};
				});
			}}
		>
			<div
				class={`font-mono rounded-md bg-slate-200 bg-opacity-90 py-4 text-center px-4 min-w-[140px] cursor-pointer shadow-md leading-4 whitespace-nowrap card ${
					playlist.uid === $playback.playlist
						? 'outline outline-2 outline-offset-2 outline-blue-400'
						: ''
				}`}
			>
				<div>
					<p>{playlist.group}</p>
					<p class="max-w-xs mt-1 text-xs truncate">{playlist.title}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
