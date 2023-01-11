<script>
	import toasts, { closeToast } from '@/stores/toasts';

	const styles = {
		success: 'bg-green-400 text-white',
		error: 'bg-red-400 text-white',
		info: 'bg-blue-400 text-white'
	};
</script>

<div class="fixed right-2 top-2 space-y-4">
	{#each [...$toasts] as toast}
		{@const success = toast.type === 'success'}
		{@const error = toast.type === 'error'}
		{@const info = toast.type === 'info'}

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => closeToast(toast.id)}
			class={`flex items-start cursor-pointer px-4 md:min-w-[260px] py-3 rounded-lg shadow-md gap-2 ${
				styles[toast.type]
			}`}
		>
			{#if success}
				<i class="fa-solid mt-1 fa-check-circle" />
			{/if}
			{#if error}
				<i class="fa-solid mt-1 fa-exclamation-circle" />
			{/if}
			{#if info}
				<i class="fa-solid mt-1 fa-info-circle" />
			{/if}

			<p class="font-medium">
				{toast.message}
			</p>
		</div>
	{/each}
</div>
