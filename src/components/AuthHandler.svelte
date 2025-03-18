<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '@/stores/auth';
	import { supabaseClient } from '@/lib/db';
	import { invalidate } from '$app/navigation';
	import { playlists } from '@/stores/playlists';
	import initialPlaylists from '@/lib/playlists';
	import { page } from '$app/stores';

	export let subscription: any = null;

	onMount(() => {
		console.log($page.data.session?.user);

		const {
			data: { subscription: authSubscription }
		} = supabaseClient.auth.onAuthStateChange((event, session) => {
			console.log('auth state changed', event, session);
			invalidate('supabase:auth');
		});

		playlists.set([...initialPlaylists, ...$page.data.playlists]);

		setTimeout(() => {
			if (!$auth.subscriptionModal && subscription?.status !== 'active')
				$auth.subscriptionModal = true;
		}, 5 * 60 * 1000);

		return () => {
			authSubscription.unsubscribe();
		};
	});
</script>
