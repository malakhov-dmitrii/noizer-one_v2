<script lang="ts">
	import { playback, selectedVariantPerSound, toggleSound, type FileItem } from '@/stores/playback';
	import SoundVariants from '@/components/SoundVariants.svelte';
	import { cx } from '@/lib/utils';
	import { paidSounds } from '@/lib/sounds';
	import { auth } from '@/stores/auth';
	import { P } from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let title: string;
	export let variants: FileItem[];

	const isPaidSound = false;
	$: showLock = false;
	// const isPaidSound = paidSounds.includes(title.toLowerCase());
	// $: showLock = isPaidSound && $page.data.subscription?.status !== 'active';

	$: selectedVariant =
		variants.find((variant) => !!$selectedVariantPerSound[variant.path]) ?? variants[0];

	$: playingVariant = $selectedVariantPerSound[selectedVariant.path];
	$: tween = !!$playback.tweenVolume;
	$: loading = !!playingVariant?.loading;
	let volume = 0.5;

	const iconBaseClass = '-translate-x-1/2 absolute text-gray-400 transition-opacity text-3xl';

	// const cardClass = `p-4 rounded-md dark:bg-gray-800 bg-slate-200 hover:bg-opacity-80 transition-all group cursor-pointer relative ${
	// 	!!playingVariant
	// 		? 'outline-2 outline-offset-2 outline-blue-500 bg-opacity-100 outline'
	// 		: 'bg-opacity-60'
	// } ${playingVariant?.loading ? 'animate-pulse outline-dashed' : ''}`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={cx(
		`card card-compact group relative bg-base-200 glass transition cursor-pointer`,
		!!playingVariant ? 'outline-2 outline-offset-4 outline-primary bg-opacity-100 outline' : '',
		playingVariant?.loading ? 'animate-pulse outline-dashed' : '',
		showLock ? 'opacity-50' : ''
	)}
	on:click={() => {
		if (showLock) {
			$auth.subscriptionModal = true;
			return;
		}

		toggleSound(selectedVariant.path);
	}}
>
	<SoundVariants {isPaidSound} {variants} selectedVariantPath={selectedVariant.path} />

	<div class={cx('card-body flex flex-col items-center justify-center text-center')}>
		<p class="px-2 mt-2 text-sm leading-4 sm:text-base sm:leading-4">
			{title}
		</p>
		<p class="max-w-full px-2 text-xs truncate opacity-70 sm:leading-2">
			{variants.length > 1 ? selectedVariant.variantName : 'Default'}
		</p>

		<div class="relative h-10 mt-2">
			<!-- DEFAULT ICON -->
			<i
				class={cx(
					iconBaseClass,
					`opacity-80 transition group-hover:opacity-0`,
					variants[0].icon?.includes('octopus') ? 'fa-brands' : 'fa-solid',
					variants[0].icon ?? 'fa-question',
					loading ? 'opacity-0' : 'opacity-100',
					!!playingVariant ? 'text-primary' : ''
				)}
			/>

			<!-- LOADING ICON -->
			<p class={`${iconBaseClass} ${loading ? 'opacity-100' : 'opacity-0'}`}>
				<i class="transition-opacity animate-spin fa-solid fa-spinner" />
			</p>

			<!-- PLAY ICON -->
			<i
				class={cx(
					iconBaseClass,
					`fa-solid fa-play`,
					loading ? 'opacity-0' : 'group-hover:opacity-100 opacity-0',
					playingVariant ? 'hidden' : 'block'
				)}
			/>

			<!-- STOP ICON -->
			<i
				class={`${iconBaseClass} fa-solid fa-pause ${
					loading ? 'opacity-0' : 'group-hover:opacity-100 opacity-0'
				} ${!playingVariant ? 'hidden' : 'block'}`}
			/>
		</div>

		{#if !tween && !showLock}
			<div class="mt-0" on:click={(e) => e.stopPropagation()}>
				<input
					type="range"
					min="0"
					max="1"
					disabled={!playingVariant}
					step="0.05"
					bind:value={volume}
					on:change={() => playingVariant?.howler?.volume(volume)}
					class={cx(
						'range range-xs range-primary',
						!playingVariant ? 'filter grayscale opacity-50' : ''
					)}
				/>
			</div>
		{/if}

		{#if showLock}
			<p class="text-xs mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
				Unlock more sounds
			</p>
		{/if}
	</div>
	{#if showLock}
		<div
			class="flex absolute pointer-events-none top-0 left-0 h-full w-full text-slate-400 flex-col justify-center items-center px-2 py-1 text-xs z-10"
		>
			<i class="fa-solid fa-lock text-7xl opacity-80" />
			<!-- <p class="text-xs mt-6">Unlock more variants</p> -->
		</div>
	{/if}
</div>
