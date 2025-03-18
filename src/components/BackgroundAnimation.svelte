<script lang="ts">
	import { cx } from '@/lib/utils';

	export let animateBackground: boolean = false;

	function toggleAnimation() {
		animateBackground = !animateBackground;
	}
</script>

{#if animateBackground}
	<div
		class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-60 pointer-events-none"
		style="background-size: 400% 400%; animation: gradient 15s ease infinite;"
	/>
{/if}

<button
	on:click={toggleAnimation}
	title="Toggle background animation"
	class={cx('btn btn-sm btn-primary', animateBackground ? 'btn-outline' : '')}
>
	<i class="fa-solid fa-wand-magic-sparkles" />
</button>

<style>
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
