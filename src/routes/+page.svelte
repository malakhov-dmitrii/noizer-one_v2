<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Label, Input, Button, Helper, Checkbox } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
	let value = form?.title ?? '';

	export function handleSubmit() {
		console.log('submit', value);
	}

	$: {
		console.log('data', data.users);
	}
</script>

<svelte:head>
	<title>SvelteKit ToDo App</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<main class="px-4 m-auto py-12 max-w-4xl prose">
	<h1>Todo app</h1>

	<form
		action="?/submitTodo"
		method="post"
		use:enhance={() => {
			// prevent default callback from resetting the form
			return ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<div class="mb-6">
			<Label for="default-input" class="block mb-2">New todo item</Label>
			<Input id="default-input" name="title" placeholder="Enter here..." bind:value />
			{#if form?.message}
				<Helper color="red">
					{form.message}
				</Helper>
			{/if}
		</div>

		<Button on:click={handleSubmit} type="submit" disabled={!value.trim()}>Submit</Button>
	</form>

	{#if !!data?.data.length}
		<h2>Todo list</h2>
		<div class="space-y-4">
			{#each data.data as todo}
				<div class="flex space-x-2 items-center">
					<Checkbox name="todo" value={todo.id} checked={todo.completed} />
					<p class={`my-0 ${todo.completed ? 'line-through' : ''}`}>
						{todo.title}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</main>
