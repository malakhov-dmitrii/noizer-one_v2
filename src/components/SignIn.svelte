<script lang="ts">
	import { auth } from '@/stores/auth';
	import { cx } from '@/lib/utils';
	import { supabaseClient } from '@/lib/db';
	import { toast } from '@/stores/toasts';
	// import mixpanel from 'mixpanel-browser';
	import * as amplitude from '@amplitude/analytics-browser';
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	$: email = '';
	let code = '';
	let codeSentFor = '';
	let codeLoading = false;
	let error = '';

	async function handleSubmit() {
		codeLoading = true;

		await supabaseClient.auth
			.signInWithOtp({
				email,
				options: { emailRedirectTo: window.location.href }
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log('err', err);
			});

		amplitude.track('signin_code_send', { email });
		posthog.capture('signin_code_send', { email });
		// await loops.createContact(email);
		fetch('https://hljlpuipsmbrognugxmp.supabase.co/functions/v1/create-contact', {
			method: 'POST',
			body: JSON.stringify({ email })
		});

		codeSentFor = email;
		codeLoading = false;

		toast('Code sent to ' + email, 'success');
	}

	async function handleGoogleSignIn() {
		await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
	}
</script>

<!-- Put this part before </body> tag -->
<input bind:checked={$auth.modal} type="checkbox" id="auth-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium p-0">Sign in</h3>
			<label class="space-y-2 flex flex-col">
				<p>Email</p>
				<input
					bind:value={email}
					class="input input-bordered"
					type="email"
					name="email"
					placeholder="name@company.com"
				/>
			</label>

			{#if error}
				<p class="text-red-500 text-xs">Provided code is invalid. Please try again.</p>
			{/if}

			<button
				class={cx('btn btn-primary', !email || codeLoading ? 'btn-disabled' : '')}
				on:click={handleSubmit}
			>
				{#if codeLoading}
					<i class="fa fa-spinner fa-spin mr-2" />
				{/if}

				Send magic link
			</button>

			<button class="btn btn-primary" on:click={handleGoogleSignIn}> With Google </button>

			<button
				class="btn btn-ghost btn-sm"
				on:click={() => {
					$auth.modal = false;
				}}
			>
				<i class="fa-solid fa-close mr-2" />

				close
			</button>
		</div>
	</div>
</div>
