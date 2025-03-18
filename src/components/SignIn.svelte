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
	$: isEmailValid = validateEmail(email);
	let code = '';
	let codeSentFor = '';
	let codeLoading = false;
	let error = '';
	let emailTouched = false;

	function validateEmail(email: string): boolean {
		if (!email) return false;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	async function handleSubmit() {
		emailTouched = true;

		if (!isEmailValid) {
			return;
		}

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
	<div class="modal-box max-w-md p-6 rounded-xl">
		<!-- Header -->
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-2xl font-bold">Sign In</h3>
			<button
				class="btn btn-circle btn-ghost btn-sm"
				on:click={() => {
					$auth.modal = false;
				}}
			>
				<i class="fa-solid fa-close" />
			</button>
		</div>

		<!-- Form -->
		<div class="space-y-5">
			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium">Email</span>
				</label>
				<input
					bind:value={email}
					class={cx(
						'input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary',
						emailTouched && !isEmailValid ? 'input-error' : ''
					)}
					type="email"
					name="email"
					placeholder="name@company.com"
					on:blur={() => (emailTouched = true)}
				/>
				{#if emailTouched && !isEmailValid}
					<label class="label">
						<span class="label-text-alt text-error">Please enter a valid email address</span>
					</label>
				{/if}
			</div>

			{#if error}
				<div class="alert alert-error text-sm py-2 px-3 rounded-lg">
					Provided code is invalid. Please try again.
				</div>
			{/if}

			<button
				class={cx(
					'btn btn-primary w-full rounded-lg',
					!isEmailValid || codeLoading ? 'btn-disabled' : ''
				)}
				on:click={handleSubmit}
			>
				{#if codeLoading}
					<i class="fa fa-spinner fa-spin mr-2" />
				{/if}
				Send Magic Link
			</button>

			<!-- Divider -->
			<div class="divider text-xs text-opacity-60">OR</div>

			<!-- Social Login -->
			<button
				class="btn btn-outline w-full rounded-lg flex items-center justify-center gap-2"
				on:click={handleGoogleSignIn}
			>
				<i class="fa-brands fa-google" />
				Continue with Google
			</button>
		</div>

		<!-- Privacy note -->
		<p class="mt-6 text-xs text-center text-opacity-70">
			By signing in, you agree to our Terms of Service and Privacy Policy
		</p>
	</div>
</div>
