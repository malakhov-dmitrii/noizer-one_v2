<script lang="ts">
	// @ts-nocheck
	import { clickOutside } from '@/lib/clickOutside';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div {...$$props} use:clickOutside on:click_outside={() => dispatch('clickOutside')}>
	<slot />
</div>
