<script>
	import { onboardingStep } from '@/stores/onboarding';
	import { onMount } from 'svelte';

	let loaded = false;
	let hide = true;

	onMount(() => {
		const localValue = +(localStorage.getItem('onboarding-basics') ?? '0');
		onboardingStep.set(localValue);
		hide = localStorage.getItem('onboarding-guide') === 'hidden';
		loaded = true;
	});
</script>

{#if !hide}
	<div class="mt-12">
		<div class="flex flex-wrap items-end gap-4">
			<h2 class="text-3xl font-medium">How to use?</h2>
			<button
				class="btn btn-xs btn-primary btn-outline"
				on:click={() => {
					onboardingStep.set(4);
					localStorage.setItem('onboarding-guide', 'hidden');
					hide = true;
				}}>Dismiss</button
			>
		</div>
		<div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-1">
			<div
				class={`px-4 py-4 bg-white rounded-md shadow-md ${$onboardingStep > 0 ? 'opacity-60' : ''}`}
			>
				<div class="flex items-center gap-2">
					<p class="text-xl font-medium">Step 1</p>
					{#if $onboardingStep > 0}
						<i class="text-green-500 fa-solid fa-check-circle" />
					{/if}
				</div>
				<p class="mt-2">Click on the sound card to play it. Click again to stop.</p>
			</div>
			<div
				class={`px-4 py-4 bg-white rounded-md shadow-md ${$onboardingStep > 1 ? 'opacity-60' : ''}`}
			>
				<div class="flex items-center gap-2">
					<p class="text-xl font-medium">Step 2</p>
					{#if $onboardingStep > 1}
						<i class="text-green-500 fa-solid fa-check-circle" />
					{/if}
				</div>
				<p class="mt-2">Toggle a few more sounds to create a mix.</p>
			</div>
			<div
				class={`px-4 py-4 bg-white rounded-md shadow-md ${$onboardingStep > 2 ? 'opacity-60' : ''}`}
			>
				<div class="flex items-center gap-2">
					<p class="text-xl font-medium">Step 3</p>
					{#if $onboardingStep > 2}
						<i class="text-green-500 fa-solid fa-check-circle" />
					{/if}
				</div>
				<p class="mt-2">Save the mix as a playlist to play it again later.</p>
			</div>
			<div
				class={`px-4 py-4 bg-white rounded-md shadow-md ${$onboardingStep > 3 ? 'opacity-60' : ''}`}
			>
				<div class="flex items-center gap-2">
					<p class="text-xl font-medium">Step 4</p>
					{#if $onboardingStep > 3}
						<i class="text-green-500 fa-solid fa-check-circle" />
					{/if}
				</div>
				<p class="mt-2">Change the variant to find your perfect match.</p>
			</div>
		</div>
	</div>
	<div class="divider" />
{/if}
