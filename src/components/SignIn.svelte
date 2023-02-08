<script lang="ts">
	import { auth } from '@/stores/auth';
	import axios from 'axios';
	import { signIn } from '@auth/sveltekit/client';
	import { cx } from '@/lib/utils';
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

<!-- Put this part before </body> tag -->
<input bind:checked={$auth.modal} type="checkbox" id="auth-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to the platform</h3>
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

			{#if codeSentFor}
				<label class="space-y-2 flex flex-col">
					<p>Code</p>
					<input
						bind:value={code}
						class="input input-bordered"
						type="text"
						name="code"
						placeholder="1234"
					/>
				</label>
			{/if}

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

				{#if codeSentFor}
					{#if codeSentFor === email}
						Verify code
					{:else}
						Resend code
					{/if}
				{:else}
					Send code
				{/if}
			</button>

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
