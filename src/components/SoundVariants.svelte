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

<!-- {#if variants.length > 1}
	<div
		class="absolute top-0 left-0 flex w-full gap-1 px-3 py-3 transition-all group-hover:opacity-0"
	>
		{#each variants as dot}
			<div class="w-1 h-1 bg-neutral-focus rounded-full" />
		{/each}
	</div>

	<div
		class="w-full transition-opacity opacity-0 group-hover:opacity-100"
		on:click|stopPropagation={(e) => {
			open = !open;
		}}
	>
		<div
			class="absolute top-0 left-0 w-full px-4 py-1.5 text-xs text-primary-content transition-all bg-primary rounded-badge opacity-50 hover:opacity-100 hover:shadow-md"
		>
			<p>{variants.length - 1} more variants</p>
		</div>
	</div>

	{#if open}
		<div>
			<HandleOutsideClick
				class="absolute top-0 left-0 z-[1000] w-full p-2 mt-2 bg-white rounded-md shadow-md"
				on:clickOutside={() => (open = !open)}
			>
				{#each variants as variant}
					{#if variant.path !== selectedVariantPath}
						<div
							class="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-all rounded-md hover:bg-gray-100"
							on:click|stopPropagation={() => {
								open = !open;
								if (subscriptionActive) {
									toggleSound(variant.path, true);
									const onboarding = get(onboardingStep);
									if (onboarding === 3) incrementOnboardingStep();
								} else {
									$auth.subscriptionModal = true;
								}
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
		</div>
	{/if}
{/if} -->

{#if variants.length > 1}
	<div
		class="absolute top-0 left-0 flex w-full gap-1 px-3 py-3 transition-all group-hover:opacity-0"
	>
		{#each variants as dot}
			<div class="w-1 h-1 bg-neutral-focus rounded-full" />
		{/each}
	</div>
	<div class="dropdown">
		<label
			tabindex="0"
			class="w-full cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
		>
			<div
				class="absolute top-0 left-0 w-full px-4 py-1.5 text-xs text-primary-content transition-all bg-primary rounded-badge opacity-50 hover:opacity-100 hover:shadow-md"
			>
				<p>{variants.length - 1} more variants</p>
			</div>
		</label>
		<ul
			tabindex="0"
			class="dropdown-content max-h-40 overflow-auto menu p-2 shadow bg-base-100 w-full rounded-box max-w-52 flex flex-col flex-nowrap"
		>
			{#each variants as variant}
				{#if variant.path !== selectedVariantPath}
					<li>
						<a
							class="flex items-center gap-2 px-2 py-1.5 text-xs  transition-all rounded-md "
							on:click|stopPropagation={() => {
								if (subscriptionActive) {
									toggleSound(variant.path, true);
									const onboarding = get(onboardingStep);
									if (onboarding === 3) incrementOnboardingStep();
								} else {
									$auth.subscriptionModal = true;
								}
							}}
						>
							{#if !variant.free}
								<i class="fa-solid fa-crown" />
							{/if}
							<p>{variant.variantName}</p>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}
