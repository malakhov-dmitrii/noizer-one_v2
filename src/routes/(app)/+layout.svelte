<script lang="ts">
	import '../../global.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import PlaybackControls from '@/components/PlaybackControls.svelte';
	import SignIn from '@/components/SignIn.svelte';
	import Toasts from '@/components/Toasts/Toasts.svelte';
	import SubscriptionModal from '@/components/SubscriptionModal.svelte';
	import { auth } from '@/stores/auth';

	// Import new components
	import Navbar from '@/components/Navbar.svelte';
	import SubscriptionBanner from '@/components/SubscriptionBanner.svelte';
	import AnalyticsProvider from '@/components/AnalyticsProvider.svelte';
	import AuthHandler from '@/components/AuthHandler.svelte';
	import MetaPixelDebug from '@/components/MetaPixelDebug.svelte';

	onMount(() => {
		themeChange(false);
	});

	$: ({ session, subscription, lemonSqueezySubscription, customerPortalUrl } = $page.data);
</script>

<AnalyticsProvider {session} />
<AuthHandler {subscription} />

<Navbar {session} {subscription} {customerPortalUrl}>
	<svelte:fragment slot="playback-controls">
		<PlaybackControls />
	</svelte:fragment>
</Navbar>

<SubscriptionBanner hasActiveSubscription={subscription?.status === 'active'} />

<div class="flex container space-x-1 m-auto flex-wrap mt-8 xl:hidden justify-center">
	<PlaybackControls />
</div>

<main>
	<slot />
</main>

<SignIn />

{#if $auth.subscriptionModal}
	<SubscriptionModal />
{/if}

<Toasts />

<!-- Debug components -->
<MetaPixelDebug />

<!-- Debug subscription info (could be moved to a dedicated component) -->
{#if session && import.meta.env.DEV}
	{#if subscription}
		<p>Subscription status: {lemonSqueezySubscription?.attributes.status}</p>
		{#if customerPortalUrl}
			<a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">Manage Subscription</a>
		{/if}
	{:else}
		<p>No active subscription</p>
	{/if}
{/if}
