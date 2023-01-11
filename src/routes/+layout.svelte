<script lang="ts">
	import '../global.css';
	import { Howler } from 'howler';
	import {
		Avatar,
		Button,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Popover,
		Range
	} from 'flowbite-svelte';

	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	import img from '$lib/images/noizer-logo.png';
	import { playback, playRandom, selectedVariantPerSound, stop } from '@/stores/playback';
	import _ from 'lodash';
	import { auth } from '@/stores/auth';
	import SignIn from '@/components/SignIn.svelte';
	import SavePlaylist from '@/components/SavePlaylist.svelte';
	import Toasts from '@/components/Toasts/Toasts.svelte';
	import playlists from '@/lib/playlists';

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
			<Button
				on:click={() => {
					$auth.modal = true;
				}}>Sign In</Button
			>
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
					disabled={!_.keys($selectedVariantPerSound).length}
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

				<SavePlaylist playlists={[...playlists, ...($page?.data?.playlists ?? [])]} />
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

<SignIn />

<Toasts />
