<script lang="ts">
	import '../../global.css';
	import { page } from '$app/stores';

	import img from '$lib/images/logo-2.png';
	import _ from 'lodash';
	import SignIn from '@/components/SignIn.svelte';
	import Toasts from '@/components/Toasts/Toasts.svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import ThemeChanger from '@/components/ThemeChanger.svelte';
	import PlaybackControls from '@/components/PlaybackControls.svelte';
	import { cx } from '@/lib/utils';
	import { signOut } from '@auth/sveltekit/client';
	import { auth } from '@/stores/auth';
	import { supabaseClient } from '@/lib/db';
	import { invalidate } from '$app/navigation';
	import { playlists } from '@/stores/playlists';
	import initialPlaylists from '@/lib/playlists';

	// TODO: toggle animation
	let animateBackground = false;

	onMount(() => {
		themeChange(false);

		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		playlists.set([...initialPlaylists, ...$page.data.playlists]);

		return () => {
			subscription.unsubscribe();
		};
	});

	$: {
		console.log($page.data);
	}
</script>

{#if animateBackground}
	<div
		class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-60 pointer-events-none"
		style="background-size: 400% 400%; animation: gradient 15s ease infinite;"
	/>
{/if}

<div class="container py-2 flex items-center m-auto">
	<div class="flex items-center flex-1 cursor-pointer">
		<img src={img} class="h-10 mr-3 sm:h-14" alt="Logo" />
		<div>
			<h3 class="text-lg md:text-3xl leading-4 font-bold">Noizer One</h3>
			<p class="hidden md:block">Live soundscapes right for you</p>
		</div>
		<!-- <a class="btn btn-ghost normal-case text-xl">Noizer One</a> -->
	</div>

	<div class="items-center space-x-1 flex-2 hidden xl:inline-flex">
		<PlaybackControls />
	</div>

	<div class="flex items-center flex-1 justify-end">
		<button
			on:click={() => {
				animateBackground = !animateBackground;
			}}
			title="Toggle background animation"
			class={cx('btn btn-sm btn-primary', animateBackground ? 'btn-outline' : '')}
		>
			<i class="fa-solid fa-wand-magic-sparkles" />
		</button>
		<ThemeChanger />
		{#if $page.data.session?.user}
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="flex gap-2 items-center cursor-pointer btn btn-ghost text-left">
					<div class="avatar">
						<div class="w-10 rounded-full">
							<img
								src={`https://api.dicebear.com/5.x/croodles/svg?seed=${$page.data.session?.user?.email}&scale=150`}
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<span class="text hidden md:block">
							{$page.data.session?.user?.email?.split('@')[0] ?? 'User'}
						</span>
					</div>
				</label>
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li on:click={() => supabaseClient.auth.signOut()}><a>Logout</a></li>
				</ul>
			</div>
		{:else}
			<button
				class="btn btn-primary"
				on:click={() => {
					$auth.modal = true;
				}}
			>
				Sign In
			</button>
		{/if}
	</div>
</div>

<div class="flex container m-auto flex-wrap mt-8 xl:hidden justify-center">
	<PlaybackControls />
</div>

<main class="">
	<slot />
</main>

<SignIn />

<Toasts />
