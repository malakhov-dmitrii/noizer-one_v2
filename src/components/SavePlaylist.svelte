<script lang="ts">
	import { page } from '$app/stores';
	import { auth } from '@/stores/auth';
	import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
	import { selectedVariantPerSound } from '@/stores/playback';
	import { toast } from '@/stores/toasts';
	import type { Playlist } from '@prisma/client';
	import axios from 'axios';

	import { Button, Helper, Input, Label, Modal } from 'flowbite-svelte';
	import { entries } from 'lodash';
	import { keys } from 'lodash';
	import { uniqBy } from 'lodash';
	import { get } from 'svelte/store';

	let savePlaylistModal = false;
	let savePlaylistTitle = '';
	let savePlaylistGroup = '';

	export let playlists: Playlist[] = [];

	async function handleSavePlaylist() {
		const data = entries($selectedVariantPerSound).map(([key, value]) => {
			return {
				volume: value?.howler?.volume() ?? 1,
				path: key
			};
		});

		const res = await axios.post('/api/playlists', {
			title: savePlaylistTitle,
			group: savePlaylistGroup,
			data
		});

		if (res.status === 200) {
			toast('Playlist saved', 'success');

			savePlaylistModal = false;
			savePlaylistTitle = '';
			savePlaylistGroup = '';

			const onboarding = get(onboardingStep);
			if (onboarding === 2) incrementOnboardingStep();

			// playlists.update((list) => {
			// 	return [...list, res.data];
			// });
		}
	}
</script>

<Button
	disabled={!keys($selectedVariantPerSound).length}
	outline
	size="sm"
	gradient
	on:click={() => {
		if (!$page.data.session) {
			$auth.modal = true;
			return;
		}
		savePlaylistModal = true;
	}}
>
	<i class="text-lg fa-solid fa-save" />
</Button>

<form class="flex flex-col space-y-6" action="#">
	<Modal title="Save new playlist" size="xs" bind:open={savePlaylistModal} autoclose>
		<!-- <h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3> -->
		<Label class="space-y-2">
			<span>Title</span>
			<Input
				name="savePlaylistTitle"
				bind:value={savePlaylistTitle}
				placeholder="Beach campfire with fan"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Group</span>
			<Input name="savePlaylistGroup" bind:value={savePlaylistGroup} placeholder="Relax" required />

			{#if uniqBy(playlists, 'group')
				.map((i) => i.group?.toLowerCase())
				.includes(savePlaylistGroup.toLowerCase())}
				<Helper>Existing group will be used</Helper>
			{:else if savePlaylistGroup.trim().length > 0}
				<Helper>New group will be created</Helper>
			{:else}
				<Helper>Its not necessary, but will help you to navigate your saved playlists</Helper>
			{/if}
		</Label>
		<svelte:fragment slot="footer">
			<Button on:click={handleSavePlaylist}>Save</Button>
			<Button color="alternative">Cancel</Button>
		</svelte:fragment>
	</Modal>
</form>
