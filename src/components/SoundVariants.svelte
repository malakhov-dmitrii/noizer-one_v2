<script lang="ts">
	import { page } from '$app/stores';
	import HandleOutsideClick from '@/components/HandleOutsideClick.svelte';
	import { auth } from '@/stores/auth';
	import { incrementOnboardingStep, onboardingStep } from '@/stores/onboarding';
	import { toggleSound, type FileItem } from '@/stores/playback';
	// import mixpanel from 'mixpanel-browser';
	import { get } from 'svelte/store';
	import * as amplitude from '@amplitude/analytics-browser';
	import posthog from 'posthog-js';

	export let variants: FileItem[];
	export let selectedVariantPath: string;
	export let isPaidSound = false;

	let open = false;
	$: subscriptionActive = $page.data?.subscription?.status === 'active';
</script>

{#if variants.length > 1}
	<div
		class="absolute top-0 left-0 flex w-full gap-1 px-3 z-10 py-3 transition-all group-hover:opacity-0"
	>
		{#each variants as dot}
			<div class="w-1 h-1 bg-neutral-focus rounded-full bg-slate-400" />
		{/each}
	</div>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="dropdown z-50" on:click|stopPropagation>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
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
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		{#if !isPaidSound}
			<ul
				tabindex="0"
				class="dropdown-content max-h-40 overflow-auto menu p-2 shadow bg-base-100 w-full rounded-box max-w-52 flex flex-col flex-nowrap"
			>
				{#each variants as variant}
					{#if variant.path !== selectedVariantPath}
						<li>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-missing-attribute -->
							<a
								class="flex items-center gap-2 px-2 py-1.5 text-xs transition-all rounded-md"
								on:click|stopPropagation={(e) => {
									amplitude.track('variant_change', {
										variant: variant.variantName,
										sound: variant.path,
										subscriptionActive
									});

									posthog.capture('variant_change', {
										variant: variant.variantName,
										sound: variant.path,
										subscriptionActive
									});

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
		{/if}
	</div>
{/if}
