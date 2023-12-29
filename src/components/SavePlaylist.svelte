<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from '@/lib/db';
	import { cx } from '@/lib/utils';
	import { auth } from '@/stores/auth';
	import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
	import { selectedVariantPerSound } from '@/stores/playback';
	import { playlists } from '@/stores/playlists';
	import { toast } from '@/stores/toasts';

	import _ from 'lodash';
	import { get } from 'svelte/store';
	import * as amplitude from '@amplitude/analytics-browser';

	let savePlaylistModal = false;
	let savePlaylistTitle = '';
	let savePlaylistGroup = '';

	async function handleSavePlaylist() {
		if (!$page.data.session?.user.id) return;
		const data = _.entries($selectedVariantPerSound).map(([key, value]) => {
			return {
				volume: value?.howler?.volume() ?? 1,
				path: key
			};
		});

		if (!savePlaylistTitle) {
			toast('Please enter a title', 'error');
			return;
		}

		amplitude.track('save_playlist', {
			title: savePlaylistTitle,
			group: savePlaylistGroup,
			sounds: data
		});

		const res = await supabaseClient
			.from('playlists')
			.insert({
				title: savePlaylistTitle,
				group: savePlaylistGroup,
				sounds: data,
				user_id: $page.data.session.user.id
			})
			.select();

		if (!res.error && res.data) {
			toast('Playlist saved', 'success');

			savePlaylistModal = false;
			savePlaylistTitle = '';
			savePlaylistGroup = '';

			const onboarding = get(onboardingStep);
			if (onboarding === 2) incrementOnboardingStep();

			goto(`/?playlist=${res.data[0].id}`);

			playlists.update((list) => {
				return [...list, res.data[0]];
			});
		}
	}
</script>

<button
	class={cx(
		'btn btn-ghost btn-primary btn-xs lg:btn-md ',
		!_.keys($selectedVariantPerSound).length ? 'btn-disabled' : ''
	)}
	on:click={() => {
		if (!$page.data.session) {
			$auth.modal = true;
			return;
		}
		savePlaylistModal = true;
	}}
>
	<i class="fa-solid fa-save mr-2" />
	Save</button
>

<!-- Put this part before </body> tag -->
<input type="checkbox" bind:checked={savePlaylistModal} id="save-preset" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<p class="text-2xl mb-4 font-bold">Save new preset</p>
		<div class="form-control w-full">
			<label class="label">
				<span class="label-text font-medium">Title</span>
			</label>
			<input
				name="savePlaylistTitle"
				bind:value={savePlaylistTitle}
				placeholder="Beach campfire with fan"
				required
				type="text"
				class="input input-bordered w-full"
			/>
		</div>
		<div class="form-control w-full">
			<label class="label">
				<span class="label-text font-medium">Group</span>
			</label>
			<input
				name="savePlaylistGroup"
				bind:value={savePlaylistGroup}
				placeholder="Relax"
				required
				type="text"
				class="input input-bordered w-full"
			/>
		</div>

		{#if !savePlaylistGroup}
			<p class="text-xs">Its not necessary, but will help you to navigate your saved playlists</p>
		{/if}

		{#if !!savePlaylistGroup && _.uniqBy($playlists, 'group')
				.map((i) => i.group?.toLowerCase())
				.includes(savePlaylistGroup.toLowerCase())}
			<p class="text-xs">Existing group will be used</p>
		{:else if savePlaylistGroup.trim().length > 0}
			<p class="text-xs">New group will be created</p>
		{/if}
		<div class="modal-action">
			<button class="btn btn-primary" on:click={handleSavePlaylist}>Save</button>
			<button
				class="btn btn-ghost"
				on:click={() => {
					savePlaylistModal = false;
				}}
				color="alternative">Cancel</button
			>
		</div>
	</div>
</div>
