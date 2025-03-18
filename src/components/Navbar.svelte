<script lang="ts">
	import img from '$lib/images/logo-2.png';
	import { auth } from '@/stores/auth';
	import ThemeChanger from '@/components/ThemeChanger.svelte';
	import UserProfileMenu from '@/components/UserProfileMenu.svelte';
	import BackgroundAnimation from '@/components/BackgroundAnimation.svelte';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null = null;
	export let subscription: any = null;
	export let customerPortalUrl: string = '';

	let animateBackground = false;
</script>

<div class="container py-2 flex items-center m-auto">
	<div class="flex items-center flex-1 cursor-pointer">
		<img src={img} class="h-10 mr-3 sm:h-12" alt="Logo" />
		<div class="">
			<h3 class="text-lg md:text-2xl leading-4 font-semibold">Noizer One</h3>
			<p class="hidden text-xs md:block">Live soundscapes right for you</p>
		</div>
	</div>

	<div class="items-center space-x-1 flex-2 hidden xl:inline-flex">
		<slot name="playback-controls" />
	</div>

	<div class="flex items-center flex-1 space-x-2 justify-end">
		<ThemeChanger />

		<BackgroundAnimation bind:animateBackground />

		<UserProfileMenu {session} {subscription} {customerPortalUrl}>
			<button
				class="btn btn-primary"
				on:click={() => {
					$auth.modal = true;
				}}
			>
				Sign In
			</button>
		</UserProfileMenu>
	</div>
</div>
