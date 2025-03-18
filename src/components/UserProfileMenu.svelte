<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '@/lib/db';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null = null;
	export let subscription: any = null;
	export let customerPortalUrl: string = '';

	const handleSignOut = () => {
		supabaseClient.auth.signOut();
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};
</script>

{#if session?.user}
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="dropdown dropdown-end">
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label tabindex="0" class="flex gap-2 items-center cursor-pointer btn btn-ghost text-left">
			<div class="avatar">
				<div class="w-10 rounded-full">
					<img
						alt="Avatar"
						src={`https://api.dicebear.com/5.x/croodles/svg?seed=${session.user?.email}&scale=150`}
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<span class="text hidden md:block">
					{session.user?.email?.split('@')[0] ?? 'User'}
				</span>

				<span class="text-xs font-light text-gray-400">
					{subscription?.status === 'active' ? 'Premium' : 'Free'}
				</span>
			</div>
		</label>
		<ul
			tabindex="0"
			class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
		>
			<li>
				<a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">
					<i class="fa-solid fa-credit-card" />
					<span>Billing</span>
				</a>
			</li>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a on:click|preventDefault={handleSignOut}>
					<i class="fa-solid fa-sign-out" />
					<span>Sign Out</span>
				</a>
			</li>
		</ul>
	</div>
{:else}
	<slot />
{/if}
