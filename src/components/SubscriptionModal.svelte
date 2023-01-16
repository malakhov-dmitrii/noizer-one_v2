<script lang="ts">
	import { auth } from '@/stores/auth';
	import { Modal } from 'flowbite-svelte';
	// import mixpanel from 'mixpanel-browser';
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<Modal bind:open={$auth.subscriptionModal} size="xs" autoclose={false}>
	<div class="flex flex-col space-y-6">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">This is the PRO feature</h3>
		<h4>Subscribe to get the access to listen all sounds</h4>

		<stripe-pricing-table
			pricing-table-id="prctbl_1MMMrFHM4ixiixxgpvO2HeTu"
			publishable-key="pk_test_51MKGVMHM4ixiixxgJOKAgByR2KNZVBCdhECdPrlS69jouagsS8AKyTGnivSGppFSTprb6gBoT8ONyYDbxupfhwAX000h8i0LD0"
		/>
	</div></Modal
>
