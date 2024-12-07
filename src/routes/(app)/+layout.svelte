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
	import { auth } from '@/stores/auth';
	import { supabaseClient } from '@/lib/db';
	import { invalidate } from '$app/navigation';
	import { playlists } from '@/stores/playlists';
	import initialPlaylists from '@/lib/playlists';
	import { dev } from '$app/environment';
	import * as amplitude from '@amplitude/analytics-browser';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
	import SubscriptionModal from '@/components/SubscriptionModal.svelte';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	// TODO: toggle animation
	let animateBackground = false;

	onMount(async () => {
		if (!dev) {
			const Anal = (await import('@vercel/analytics')).default;
			Anal.inject({ mode: 'production' });
		}

		console.log($page.data.session?.user);

		amplitude.init(PUBLIC_AMPLITUDE_API_KEY);

		themeChange(false);

		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange((event, session) => {
			console.log('auth state changed', event, session);
			invalidate('supabase:auth');
		});

		playlists.set([...initialPlaylists, ...$page.data.playlists]);

		setTimeout(() => {
			if (!$auth.subscriptionModal && $page.data.subscription?.status !== 'active')
				$auth.subscriptionModal = true;
		}, 5 * 60 * 1000);

		return () => {
			subscription.unsubscribe();
		};
	});

	$: {
		if ($page.data.session?.user.email) {
			const identify = new amplitude.Identify();
			identify.set('email', $page.data.session?.user.email);
			identify.set('name', $page.data.session?.user.email?.split('@')[0] ?? 'User');
			identify.set('userId', $page.data.session?.user.id);
			amplitude.identify(identify);

			posthog.identify($page.data.session?.user.id, {
				email: $page.data.session?.user.email
			});
		}
	}

	const billingPortalHref = $page.data.customerPortalUrl;

	const lemonsqueezyHref = dev
		? 'https://noizer-one.lemonsqueezy.com/buy/5da8b314-8f3c-4818-a14b-828b0fde9164?embed=1'
		: 'https://noizer-one.lemonsqueezy.com/buy/ba8aa9fe-b088-44e7-a9de-2478e1c95ade?embed=1&enabled=335134';

	$: ({ session, subscription, lemonSqueezySubscription, customerPortalUrl } = $page.data);
</script>

{#if animateBackground}
	<div
		class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-60 pointer-events-none"
		style="background-size: 400% 400%; animation: gradient 15s ease infinite;"
	/>
{/if}

<div class="container py-2 flex items-center m-auto">
	<div class="flex items-center flex-1 cursor-pointer">
		<img src={img} class="h-10 mr-3 sm:h-12" alt="Logo" />
		<div class="">
			<h3 class="text-lg md:text-2xl leading-4 font-semibold">Noizer One</h3>
			<p class="hidden text-xs md:block">Live soundscapes right for you</p>
		</div>
		<!-- <a class="btn btn-ghost normal-case text-xl">Noizer One</a> -->
	</div>

	<div class="items-center space-x-1 flex-2 hidden xl:inline-flex">
		<PlaybackControls />
	</div>

	<div class="flex items-center flex-1 space-x-2 justify-end">
		<ThemeChanger />

		<button
			on:click={() => {
				animateBackground = !animateBackground;
			}}
			title="Toggle background animation"
			class={cx('btn btn-sm btn-primary', animateBackground ? 'btn-outline' : '')}
		>
			<i class="fa-solid fa-wand-magic-sparkles" />
		</button>
		{#if $page.data.session?.user}
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="flex gap-2 items-center cursor-pointer btn btn-ghost text-left">
					<div class="avatar">
						<div class="w-10 rounded-full">
							<img
								alt="Avatar"
								src={`https://api.dicebear.com/5.x/croodles/svg?seed=${$page.data.session?.user?.email}&scale=150`}
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<span class="text hidden md:block">
							{$page.data.session?.user?.email?.split('@')[0] ?? 'User'}
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
					<li>
						<a href={billingPortalHref} target="_blank" rel="noopener noreferrer">
							<i class="fa-solid fa-credit-card" />
							<span>Billing</span>
						</a>
					</li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							on:click|preventDefault={() => {
								supabaseClient.auth.signOut();
								setTimeout(() => {
									window.location.reload();
								}, 1000);
							}}
						>
							<i class="fa-solid fa-sign-out" />
							<span>Sign Out</span>
						</a>
					</li>
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

{#if $page.data.subscription?.status !== 'active'}
	<a
		href={lemonsqueezyHref}
		class="lemonsqueezy-button w-full block text-center py-4 cursor-pointer bg-primary text-primary-content font-bold"
	>
		<!-- <span class="line-through">8.18$/month</span> -->
		<span class="py-1 bg-primary-content rounded-md px-2 text-primary">LIFETIME DEAL: 24$ </span>

		Unlock 200+ sounds and advanced features!</a
	><script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
{/if}

<div class="flex container space-x-1 m-auto flex-wrap mt-8 xl:hidden justify-center">
	<PlaybackControls />
</div>

<main class="">
	<slot />
</main>

<SignIn />

{#if $auth.subscriptionModal}
	<SubscriptionModal />
{/if}

<Toasts />

{#if session}
	{#if subscription}
		<p>Subscription status: {lemonSqueezySubscription?.attributes.status}</p>
		{#if customerPortalUrl}
			<a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">Manage Subscription</a>
		{/if}
	{:else}
		<p>No active subscription</p>
	{/if}
{/if}
