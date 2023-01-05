<script lang="ts">
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if $page.data.session?.user}
	<main class="prose max-w-4xl m-auto my-12">
		<h1>Profile page - {$page.data.session?.user?.email}</h1>
	</main>
{:else}
	<main class="prose max-w-4xl m-auto my-12">
		<h1>Profile page</h1>
		<p>You are not logged in to view this page</p>
		<Button on:click={() => signIn('github')}>Sign In with GitHub</Button>
	</main>
{/if}
