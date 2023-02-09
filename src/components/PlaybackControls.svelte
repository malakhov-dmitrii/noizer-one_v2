<script lang="ts">
	import { page } from '$app/stores';
	import SavePlaylist from '@/components/SavePlaylist.svelte';
	import playlists from '@/lib/playlists';
	import { auth } from '@/stores/auth';
	import { playback, playRandom, stop, toggleTweenVolume } from '@/stores/playback';

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

<button class="btn btn-xs lg:btn-md btn-ghost btn-primary" on:click={handleMute}>
	{#if $playback.muted}
		<i class="mr-2 fa-solid fa-volume-mute" />
		unMute
	{:else}
		<i class="mr-2 fa-solid fa-volume-up" />
		Mute
	{/if}
</button>
<button class="btn btn-xs lg:btn-md btn-ghost btn-primary" on:click={stop}>
	<i class="fa-solid fa-stop mr-2" />
	Stop</button
>
<button
	class="btn btn-xs lg:btn-md btn-ghost btn-primary"
	on:click={() => {
		if (!$page.data.subscription) {
			$auth.subscriptionModal = true;
			return;
		} else {
			toggleTweenVolume();
		}
		console.log($page.data);
	}}
>
	<i class="fa-solid fa-wave-sine mr-2" />
	Tween volume</button
>

<SavePlaylist playlists={[...playlists, ...($page?.data?.playlists ?? [])]} />

<button on:click={playRandom} class="btn btn-xs lg:btn-md btn-ghost btn-primary">
	<i class="fa-solid fa-shuffle mr-2" />
	Shuffle</button
>
