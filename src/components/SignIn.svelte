<script lang="ts">
	import { auth } from '@/stores/auth';
	import axios from 'axios';
	import { signIn } from '@auth/sveltekit/client';
	import { Button, Checkbox, Helper, Hr, Input, Label, Modal } from 'flowbite-svelte';
	// import mixpanel from 'mixpanel-browser';

	$: email = '';
	let code = '';
	let codeSentFor = '';
	let codeLoading = false;
	let error = '';

	async function handleSubmit() {
		// Send request to /api/auth/send-code
		// If code is sent, show input for code
		// If code is correct, close modal
		if (!codeSentFor || codeSentFor !== email) {
			codeLoading = true;
			await axios.post('/api/auth/send-code', { email });

			codeLoading = false;
			codeSentFor = email;
		} else {
			codeLoading = false;
			const r = await signIn('credentials', { email, password: code, redirect: false });
			const data = await r?.json();
			if (data?.url?.includes('error')) {
				codeSentFor = '';
				error = data.url.split('error=')[1];
			} else {
				// mixpanel.identify(email);
				// mixpanel.people.set({ email, last_login: new Date().toISOString() });
				$auth.modal = false;
				email = '';
			}
		}
	}
</script>

<Modal bind:open={$auth.modal} size="xs" autoclose={false}>
	<div class="flex flex-col space-y-6">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to the platform</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input bind:value={email} type="text" name="email" placeholder="name@company.com" />
		</Label>

		{#if codeSentFor}
			<Label class="space-y-2">
				<span>Code</span>
				<Input bind:value={code} type="text" name="code" placeholder="1234" />
			</Label>
		{/if}

		{#if error}
			<Helper color="red">Provided code is invalid. Please try again.</Helper>
		{/if}

		<Button disabled={!email || codeLoading} class="w-full" on:click={handleSubmit}>
			{#if codeLoading}
				<i class="fa fa-spinner fa-spin mr-2" />
			{/if}

			{#if codeSentFor}
				{#if codeSentFor === email}
					Verify code
				{:else}
					Resend code
				{/if}
			{:else}
				Send code
			{/if}
		</Button>
	</div>

	<Hr />

	<!-- <Button class="w-full" size="xs" outline on:click={() => signIn('google')}>
		<i class="text-lg fa-brands fa-google" />
		<span class="ml-2">Sign in with Google</span>
	</Button> -->

	<!-- Sign In with GitHub -->
	<!-- <Button class="w-full" size="xs" outline on:click={() => signIn('github')}>
		<i class="text-lg fa-brands fa-github" />
		<span class="ml-2">Sign in with GitHub</span>
	</Button> -->
</Modal>
