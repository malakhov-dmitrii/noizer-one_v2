<script lang="ts">
	import '../../global.css';
	import { page } from '$app/stores';

	import img from '$lib/images/logo-2.png';
	import _ from 'lodash';
	import SignIn from '@/components/SignIn.svelte';
	import Toasts from '@/components/Toasts/Toasts.svelte';
	import SubscriptionModal from '@/components/SubscriptionModal.svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import ThemeChanger from '@/components/ThemeChanger.svelte';
	import PlaybackControls from '@/components/PlaybackControls.svelte';
	import { cx } from '@/lib/utils';
	import { signOut } from '@auth/sveltekit/client';
	import { auth } from '@/stores/auth';

	// TODO: toggle animation
	let animateBackground = true;

	onMount(() => {
		themeChange(false);
	});
</script>

{#if animateBackground}
	<div
		class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-60 pointer-events-none"
		style="background-size: 400% 400%; animation: gradient 15s ease infinite;"
	/>
{/if}

<div class="navbar bg-transparent container m-auto">
	<div class="navbar-start cursor-pointer">
		<img src={img} class="h-10 mr-3 sm:h-14" alt="Logo" />
		<div>
			<h3 class="text-lg md:text-3xl leading-4 font-bold">Noizer One</h3>
			<p class="hidden md:block">Live soundscapes right for you</p>
		</div>
		<!-- <a class="btn btn-ghost normal-case text-xl">Noizer One</a> -->
	</div>

	<div class="navbar-center space-x-1 hidden lg:inline-flex">
		<PlaybackControls />
	</div>

	<div class="navbar-end">
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
							<img src={$page.data.session?.user?.image} />
						</div>
					</div>
					<div class="flex flex-col">
						<span class="text hidden md:block">
							{$page.data.session?.user?.name ?? 'User'}
						</span>
						<span class="text-xs font-light text-gray-400">
							{$page.data.subscription?.status === 'active' ? 'Premium' : 'Free'}
						</span>
					</div>
				</label>
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li><a>Billing</a></li>
					<li on:click={() => signOut()}><a>Logout</a></li>
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

<div class="flex lg:hidden container flex-wrap mt-8 justify-center">
	<PlaybackControls />
</div>

<main class="">
	<slot />
</main>

<SignIn />
<SubscriptionModal />

<Toasts />
