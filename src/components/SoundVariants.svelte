<script lang="ts">
	import { page } from '$app/stores';
	import HandleOutsideClick from '@/components/HandleOutsideClick.svelte';
	import { auth } from '@/stores/auth';
	import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
	import { toggleSound, type FileItem } from '@/stores/playback';
	// import mixpanel from 'mixpanel-browser';
	import { get } from 'svelte/store';

	export let variants: FileItem[];
	export let selectedVariantPath: string;

	let open = false;
	$: subscriptionActive = $page.data?.subscription?.status === 'active';
</script>

{#if variants.length > 1}
	<div
		class="absolute top-0 left-0 flex w-full gap-1 px-3 py-3 transition-all group-hover:opacity-0"
	>
		{#each variants as dot}
			<div class="w-1 h-1 bg-gray-400 rounded-full" />
		{/each}
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="w-full transition-opacity opacity-0 group-hover:opacity-100"
		on:click|stopPropagation={(e) => {
			open = !open;
		}}
	>
		<div
			class="absolute top-0 left-0 w-full px-2 py-1.5 text-xs text-white transition-all bg-blue-500 rounded-md opacity-50 hover:opacity-100 hover:shadow-md"
		>
			<p>{variants.length - 1} more variants</p>
		</div>
	</div>

	{#if open}
		<HandleOutsideClick
			class="absolute top-0 left-0 z-10 w-full p-2 mt-2 bg-white rounded-md shadow-md"
			on:clickOutside={() => (open = !open)}
		>
			{#each variants as variant}
				{#if variant.path !== selectedVariantPath}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="flex items-center justify-between px-2 py-1.5 text-xs text-gray-700 transition-all rounded-md hover:bg-gray-100"
						on:click|stopPropagation={() => {
							open = !open;
							if (subscriptionActive) {
								toggleSound(variant.path, true);
								const onboarding = get(onboardingStep);
								if (onboarding === 3) incrementOnboardingStep();
							} else {
								$auth.subscriptionModal = true;
							}

							// mixpanel.track('Sound Variant Selected', {
							// 	variant: variant.variantName,
							// 	sound: variant.sound,
							// 	group: variant.group,
							// 	free: variant.free
							// });
						}}
					>
						{#if !variant.free}
							<i class="fa-solid fa-crown" />
						{/if}
						<p>{variant.variantName}</p>
					</div>
				{/if}
			{/each}
		</HandleOutsideClick>
	{/if}
{/if}
