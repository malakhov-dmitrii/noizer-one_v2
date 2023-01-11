<script lang="ts">
	import shortcuts from '@/lib/shortcuts';
	import { Kbd } from 'flowbite-svelte';
</script>

<div class="absolute hidden w-56 px-4 py-2 border-gray-400 rounded-md -right-64 top-12 xl:block">
	<h3 class="mt-2 font-mono text-lg font-medium text-gray-600">Shortcuts guide</h3>
	<div class="pb-4 mt-4 space-y-3">
		{#each shortcuts as shortcut}
			<p class="font-mono text-sm text-gray-500">
				<Kbd class="px-2 py-1">{shortcut.keys.join('+')}</Kbd>
				{shortcut.title}
				<!-- <td>{shortcut.description}</td> -->
			</p>
		{/each}
	</div>
</div>
