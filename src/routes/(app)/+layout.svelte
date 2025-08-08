<script lang="ts">
	import '../../global.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import PlaybackControls from '@/components/PlaybackControls.svelte';
	import Toasts from '@/components/Toasts/Toasts.svelte';

	// Import new components
	import Navbar from '@/components/Navbar.svelte';
	import AnalyticsProvider from '@/components/AnalyticsProvider.svelte';
	import MetaPixelDebug from '@/components/MetaPixelDebug.svelte';

	onMount(() => {
		themeChange(false);
	});

	$: ({ session, subscription, lemonSqueezySubscription, customerPortalUrl } = $page.data);
</script>

<AnalyticsProvider {session} />

<Navbar>
	<svelte:fragment slot="playback-controls">
		<PlaybackControls />
	</svelte:fragment>
</Navbar>

<div class="flex container space-x-1 m-auto flex-wrap mt-8 xl:hidden justify-center">
	<PlaybackControls />
</div>

<main>
	<slot />
</main>

<Toasts />

<!-- Debug components -->
<MetaPixelDebug />
