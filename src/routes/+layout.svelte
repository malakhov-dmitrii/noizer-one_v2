<script lang="ts">
	import '../global.css';
	import {
		Avatar,
		Button,
		ButtonGroup,
		Helper,
		Input,
		Label,
		Modal,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		P,
		Popover,
		Range,
		Select
	} from 'flowbite-svelte';

	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';

	import img from '$lib/images/noizer-logo.png';
	import { playback, playRandom, selectedVariantPerSound, stop } from '@/stores/playback';
	import { keys } from 'lodash';
	import { entries } from 'lodash';
	import playlists from '@/lib/playlists';
	import { uniqBy } from 'lodash';
	import { lowerCase } from 'lodash';

	$: savedVolume = 1;

	function handleMute() {
		if (!$playback.muted) {
			savedVolume = $playback.volume;
			$playback.volume = 0;
		} else {
			$playback.volume = savedVolume;
		}

		Howler.mute(!$playback.muted);
		playback.set({
			...$playback,
			muted: !$playback.muted
		});
	}

	let savePlaylistModal = false;
	let savePlaylistTitle = '';
	let savePlaylistGroup = '';

	function handleSavePlaylist() {
		const data = entries($selectedVariantPerSound).map(([key, value]) => {
			return {
				volume: value?.howler?.volume() ?? 1,
				path: key
			};
		});

		fetch('/api/playlists', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: savePlaylistTitle,
				group: savePlaylistGroup,
				data
			})
		});
	}
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img src={img} class="h-6 mr-3 sm:h-9" alt="Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			Noizer One
		</span>
	</NavBrand>
	<!-- <NavHamburger on:click={toggle} /> -->
	<div class="flex items-center gap-2 mt-4 md:order-2 sm:mt-0">
		{#if $page.data.session}
			<a href="/profile" class="flex items-center gap-2">
				{#if $page.data.session.user?.image}
					<Avatar src={$page.data.session.user.image} />
				{/if}
				<div class="flex flex-col text-sm">
					<span class="text-sm">
						{$page.data.session.user?.name ?? 'User'}
					</span>
					<span class="text-xs font-light text-gray-400">User</span>
				</div>
			</a>

			<Button size="xs" outline on:click={() => signOut()} class="button">Sign out</Button>
		{:else}
			<Button size="xs" on:click={() => signIn('github')}>Sign In with GitHub</Button>
		{/if}
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi>
			<div class="flex gap-2">
				<Button
					outline
					size="sm"
					gradient
					on:click={stop}
					disabled={!keys($selectedVariantPerSound).length}
				>
					<i class="text-lg text-gray-700 fa-solid fa-stop" />
				</Button>
				<Button outline size="sm" gradient id="volume" on:click={handleMute}>
					{#if $playback.muted}
						<i class="text-lg text-gray-700 fa-solid fa-volume-mute" />
					{:else}
						<i class="text-lg text-gray-700 fa-solid fa-volume-up" />
					{/if}
				</Button>
				<Button outline size="sm" gradient on:click={playRandom}>
					<i class="text-lg fa-solid fa-shuffle" />
				</Button>
				<Button
					disabled={!keys($selectedVariantPerSound).length}
					outline
					size="sm"
					gradient
					on:click={() => (savePlaylistModal = true)}
				>
					<i class="text-lg fa-solid fa-save" />
				</Button>
			</div>
		</NavLi>
	</NavUl>
</Navbar>
<Popover
	title={`Volume: ${($playback.volume * 100).toFixed(0)}%`}
	class="w-64 text-sm font-light"
	triggeredBy="#volume"
	placement="bottom"
>
	<Range
		bind:value={$playback.volume}
		min={0}
		max={1}
		step={0.05}
		on:change={(e) => {
			// @ts-expect-error - Howler is not typed properly
			Howler.volume(+e.target?.value);
		}}
	/>
</Popover>

<main class="">
	<slot />
</main>

<form class="flex flex-col space-y-6" action="#">
	<Modal title="Save new playlist" bind:open={savePlaylistModal} autoclose>
		<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
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
				.map((i) => i.group.toLowerCase())
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
