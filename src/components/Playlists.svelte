<script lang="ts">
	import { page } from '$app/stores';
	import playlists from '@/lib/playlists';
	import { playback, playPlaylist } from '@/stores/playback';
	import { toast } from '@/stores/toasts';
	import type { Playlist } from '@prisma/client';
	import axios from 'axios';
	import { Button, Kbd, Modal } from 'flowbite-svelte';

	let userPlaylists = [...playlists, ...$page.data.playlists] as Playlist[];
	let deletePlaylistModal = false;
	let deletePlaylistId = '';

	/**
	 * Handle delete playlist
	 *
	 * If deletePlaylistId is set, we are in the process of deleting a playlist
	 * and we should not allow the user to delete another playlist until the
	 * first one is deleted.
	 *
	 * If deletePlaylistModal is set, we know that user confirmed the deletion
	 * and we should delete the playlist.
	 *
	 * If deletePlaylistId is not set, we should set it to the id of the playlist
	 * and show the modal.
	 *
	 * @param id - Playlist id
	 */
	async function handleDelete(id = deletePlaylistId) {
		if (!deletePlaylistId) {
			deletePlaylistId = id;
			deletePlaylistModal = true;
			return;
		}
		const res = await axios.delete(`/api/playlists/${id}`);
		if (res.status === 200) {
			toast('Playlist deleted', 'success');
			userPlaylists = userPlaylists.filter((playlist) => playlist.id !== id);
		}
	}
</script>

<h2 class="mt-10 text-2xl font-medium">Playlists</h2>
<div class="items-center gap-2 text-sm text-gray-600 hidden lg:flex">
	<p>Use keyboard numbers for quick select: from</p>

	<Kbd class="px-2 py-1">1</Kbd>
	<p>to</p>
	<Kbd class="px-2 py-1">9</Kbd>
</div>

<div class="flex gap-4 px-1 pt-2 pb-3 -mx-1 overflow-x-auto overflow-y-visible flex-nowrap">
	{#each userPlaylists as playlist}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative group"
			on:click={() => {
				playPlaylist(playlist);
				playback.update((state) => {
					return {
						...state,
						playlist: playlist.id
					};
				});
			}}
		>
			<div
				class={`relative font-mono h-16 rounded-md bg-slate-200 bg-opacity-90 py-4 text-center px-4 min-w-[140px] cursor-pointer shadow-md leading-4 whitespace-nowrap card ${
					playlist.id === $playback.playlist
						? 'outline outline-2 outline-offset-2 outline-blue-400'
						: ''
				}`}
			>
				<p class="line-clamp-1">{playlist.group || playlist.title}</p>
				{#if playlist.group}
					<p class="text-xs max-w-[160px] text-gray-500 line-clamp-2">
						{playlist.title}
					</p>
				{/if}

				<!-- DELETE PLAYLIST -->
				{#if playlist.userId}
					<button
						title="Delete playlist"
						class="absolute top-0 right-0 p-2 text-gray-500 opacity-20 hover:opacity-100 transition-opacity rounded-md hover:bg-gray-200"
						on:click|stopPropagation={() => handleDelete(playlist.id)}
					>
						<i class="fa-solid fa-trash" />
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>

<Modal bind:open={deletePlaylistModal} size="xs" autoclose>
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this playlist?
		</h3>
		<Button color="red" class="mr-2" on:click={() => handleDelete()}>Yes, I'm sure</Button>
		<Button
			color="alternative"
			on:click={() => {
				deletePlaylistModal = false;
				deletePlaylistId = '';
			}}>No, cancel</Button
		>
	</div>
</Modal>
