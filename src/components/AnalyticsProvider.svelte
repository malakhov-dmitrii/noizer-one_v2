<script lang="ts">
	import { onMount } from 'svelte';
	import * as amplitude from '@amplitude/analytics-browser';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
	import { dev } from '$app/environment';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';
	import { trackPixelEvent, trackFeatureEngagement } from '@/lib/analytics';

	export let session: Session | null = null;

	// Store current path to prevent duplicate PageView events
	let currentPath = '';

	if (browser) {
		// Set initial path
		currentPath = window.location.pathname;

		beforeNavigate(() => {
			posthog.capture('$pageleave');
		});

		afterNavigate((navigation) => {
			// Only track PageView when the actual URL path changes
			const newPath = navigation.to?.url.pathname || '';

			if (newPath !== currentPath) {
				// Track in PostHog
				posthog.capture('$pageview');

				// Track in Meta Pixel
				trackPixelEvent('PageView');

				// Track as feature engagement
				trackFeatureEngagement(`visit_${newPath.replace(/\//g, '_') || 'unknown'}`);

				// Update current path
				currentPath = newPath;
			}
		});
	}

	onMount(async () => {
		if (!dev) {
			const analytics = await import('@vercel/analytics');
			analytics.inject({ mode: 'production' });
		}

		amplitude.init(PUBLIC_AMPLITUDE_API_KEY);

		// Verify Meta Pixel is working by checking for _fbq
		if (browser && !window._fbq) {
			console.warn('[Meta Pixel] Facebook Pixel tracker not properly initialized');
		} else if (browser) {
			console.log('[Meta Pixel] Successfully initialized');
		}

		return () => {
			// Cleanup if needed
		};
	});

	$: {
		if (session?.user?.email) {
			const identify = new amplitude.Identify();
			identify.set('email', session.user.email);
			identify.set('name', session.user.email?.split('@')[0] ?? 'User');
			identify.set('userId', session.user.id);
			amplitude.identify(identify);

			posthog.identify(session.user.id, {
				email: session.user.email
			});
		}
	}
</script>

<slot />
