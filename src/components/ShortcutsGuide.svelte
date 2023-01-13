<script lang="ts">
	import shortcuts from '@/lib/shortcuts';
	import { Kbd } from 'flowbite-svelte';
</script>

<h3 class="mt-2 font-mono text-lg font-medium ">Shortcuts guide</h3>
<div class="pb-4 mt-4 space-y-3">
	{#each shortcuts as shortcut}
		<p class="font-mono text-sm text-gray-500">
			<Kbd class="px-2 py-1">{shortcut.keys.join('+')}</Kbd>
			{shortcut.title}
			<!-- <td>{shortcut.description}</td> -->
		</p>
	{/each}
</div>
