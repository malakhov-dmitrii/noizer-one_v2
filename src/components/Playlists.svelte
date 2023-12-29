<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { supabaseClient } from '@/lib/db';
	import { playback, playPlaylist } from '@/stores/playback';
	import { playlists } from '@/stores/playlists';
	import { toast } from '@/stores/toasts';
	import _ from 'lodash';

	// let userPlaylists = [
	// 	...initialPlaylists,
	// 	...(_.uniqBy($page.data.playlists ?? [], 'id') ?? [])
	// ] as (Playlist & {
	// 	user: User;
	// })[];
	let deletePlaylistModal = false;
	let deletePlaylistId = null as number | null;

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

		const res = await supabaseClient.from('playlists').delete().eq('id', id);
		if (res.error) {
			toast('Failed to delete playlist', 'error');
			return;
		} else {
			toast('Playlist deleted', 'success');
			playlists.update((list) => {
				return list.filter((playlist) => playlist.id !== id);
			});
			deletePlaylistModal = false;
			deletePlaylistId = null;
		}
	}
</script>

<h2 class="mt-10 text-2xl font-medium">Playlists</h2>
<div class="items-center gap-2 text-sm hidden lg:flex">
	<p>Use keyboard numbers for quick select: from</p>

	<span class="kbd kbd-xs px-2">1</span>
	<p>to</p>
	<span class="kbd kbd-xs px-2">9</span>
</div>

<div class="flex gap-4 px-1 pt-2 pb-3 -mx-1 overflow-x-auto overflow-y-visible flex-nowrap">
	{#each $playlists as playlist}
		{@const belongsToOtherUser =
			playlist.user_id !== 'admin' &&
			!!playlist.user_id &&
			playlist.user_id !== $page.data.session?.user.id}
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
				class={`relative font-mono h-16 card-bordered glass rounded-md bg-base-200 bg-opacitynull0 py-4 text-center px-4 min-w-[140px] cursor-pointer shadow-md leading-4 whitespace-nowrap card ${
					playlist.id === $playback.playlist
						? 'outline outline-2 outline-offset-2 outline-primary'
						: ''
				} 
				
				${!!playlist.user_id ? 'bg-base-200' : 'bg-base-100'}
				`}
			>
				{#if belongsToOtherUser}
					<div
						on:click|stopPropagation={async () => {
							if (!$page.data.session?.user.id) {
								toast('You must be logged in to save playlists', 'error');
								return;
							}

							const { id, ...data } = playlist;
							const res = await supabaseClient.from('playlists').insert({
								...data,
								user_id: $page.data.session?.user.id
							});
							if (res.error) {
								toast('Failed to save playlist', 'error');
								return;
							} else {
								toast('Playlist copied to your library', 'success');
							}
						}}
						class="absolute bottom-0 opacity-50 hover:opacity-100 transition w-full py-0.5 rounded-md -left-0 bg-primary text-primary-content text-xs transform px-2"
					>
						save to library
					</div>
				{/if}
				<!-- ${playlist.userId !== $page.data.session?.user.} -->
				<p class="line-clamp-1">{playlist.group || playlist.title}</p>
				{#if playlist.group}
					<p class="text-xs max-w-[160px] line-clamp-2">
						{playlist.title}
					</p>
				{/if}

				<!-- DELETE PLAYLIST -->
				{#if playlist.user_id !== 'admin' && playlist.user_id && !belongsToOtherUser}
					<button
						title="Delete playlist"
						class="absolute top-0 right-0 p-2 opacity-20 hover:opacity-100 transition-opacity rounded-md"
						on:click|stopPropagation={() => handleDelete(playlist.id)}
					>
						<i class="fa-solid fa-trash" />
					</button>
				{/if}
				<!-- CREATE SHAREABLE LINK TO THE PLAYLIST -->
				{#if playlist.user_id !== 'admin' && playlist.user_id}
					<button
						title="Copy link to clipboard"
						class="absolute top-0 left-0 p-2 text-accent opacity-40 hover:opacity-100 transition-opacity rounded-md"
						on:click|stopPropagation={() => {
							navigator.clipboard.writeText(`https://noizer.one/?playlist=${playlist.id}`);
							toast('Link to the preset copied to clipboard', 'success');
						}}
					>
						<i class="fa-solid fa-copy" />
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>

<!-- Put this part before </body> tag -->

<input
	type="checkbox"
	bind:checked={deletePlaylistModal}
	id="delete-playlist-modal"
	class="modal-toggle"
/>

<div class="modal">
	<div class="modal-box">
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
		</div>

		<div class="modal-action">
			<label
				for="delete-pokaylist-modal"
				on:click={() => {
					deletePlaylistModal = false;
					deletePlaylistId = null;
				}}
				class="btn btn-ghost">Cancel</label
			>
			<label
				for="delete-pokaylist-modal"
				on:click={() => {
					handleDelete();
				}}
				class="btn btn-error">Yes, delete</label
			>
		</div>
	</div>
</div>

<!-- <Modal bind:open={deletePlaylistModal} size="xs" autoclose>
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
</Modal> -->
