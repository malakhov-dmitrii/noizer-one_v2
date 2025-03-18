<script lang="ts">
	import { onMount } from 'svelte';
	import * as amplitude from '@amplitude/analytics-browser';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
	import { dev } from '$app/environment';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null = null;

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	onMount(async () => {
		if (!dev) {
			const analytics = await import('@vercel/analytics');
			analytics.inject({ mode: 'production' });
		}

		amplitude.init(PUBLIC_AMPLITUDE_API_KEY);

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
