<script lang="ts">
	import '../global.css';
	import { Avatar, Button, Navbar, NavBrand, NavHamburger, NavLi, NavUl, P } from 'flowbite-svelte';

	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
			src="https://flowbite.com/docs/images/logo.svg"
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Custom Todo
		</span>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<div class="flex md:order-2 gap-2 items-center">
		{#if $page.data.session}
			{#if $page.data.session.user?.image}
				<Avatar src={$page.data.session.user.image} />
			{/if}
			<div class="flex flex-col text-sm">
				<span class="text-sm">
					{$page.data.session.user?.name ?? 'User'}
				</span>
				<span class="text-xs text-gray-400 font-light">User</span>
			</div>

			<Button size="xs" outline on:click={() => signOut()} class="button">Sign out</Button>
		{:else}
			<Button size="xs" on:click={() => signIn('github')}>Sign In with GitHub</Button>
		{/if}
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/profile" active={true}>Profile</NavLi>
		<!-- <NavLi href="/todo">ToDo</NavLi> -->
	</NavUl>
</Navbar>

<main class="">
	<slot />
</main>
