<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '@/stores/auth';
	import { supabaseClient } from '@/lib/db';
	import { invalidate } from '$app/navigation';
	import { playlists } from '@/stores/playlists';
	import initialPlaylists from '@/lib/playlists';
	import { page } from '$app/stores';
	import { trackLoginSuccess, trackSignUp, trackSubscription } from '@/lib/analytics';

	export let subscription: any = null;
	let previousAuthState = !!$page.data.session;

	onMount(() => {
		console.log($page.data.session?.user);

		const {
			data: { subscription: authSubscription }
		} = supabaseClient.auth.onAuthStateChange((event, session) => {
			console.log('auth state changed', event, session);
			invalidate('supabase:auth');

			// Track auth events with Meta Pixel
			if (event === 'SIGNED_IN') {
				const method = session?.user?.app_metadata?.provider === 'google' ? 'google' : 'email';

				// Check if user was previously logged out (to avoid duplicate events)
				if (!previousAuthState) {
					// If this is a new user (created_at is very recent)
					const createdAt = new Date(session?.user?.created_at || '');
					const fiveMinutesAgo = new Date();
					fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

					if (createdAt > fiveMinutesAgo) {
						// This is likely a new signup
						trackSignUp(method, session?.user?.email);
					} else {
						// This is a regular login
						trackLoginSuccess(method);
					}
				}

				// Update auth state
				previousAuthState = true;
			} else if (event === 'SIGNED_OUT') {
				previousAuthState = false;
			}
		});

		playlists.set([...initialPlaylists, ...$page.data.playlists]);

		// Track subscription status
		if (subscription?.status === 'active' && $page.data.session) {
			trackSubscription(24.0); // Fixed price for now
		}

		setTimeout(() => {
			if (!$auth.subscriptionModal && subscription?.status !== 'active')
				$auth.subscriptionModal = true;
		}, 5 * 60 * 1000);

		return () => {
			authSubscription.unsubscribe();
		};
	});
</script>
