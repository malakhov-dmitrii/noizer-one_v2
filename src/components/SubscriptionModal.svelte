<script lang="ts">
	import { auth } from '@/stores/auth';
	import { Modal } from 'flowbite-svelte';
	// import mixpanel from 'mixpanel-browser';
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<!-- Put this part before </body> tag -->
<input
	type="checkbox"
	bind:checked={$auth.subscriptionModal}
	id="subs-modal"
	class="modal-toggle"
/>
<div class="modal">
	<div class="modal-box">
		<div class="flex flex-col space-y-6">
			<div class="flex justify-between items-center">
				<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
					This is the PRO feature
				</h3>

				<button
					class="btn btn-circle btn-ghost"
					on:click={() => {
						$auth.subscriptionModal = !$auth.subscriptionModal;
					}}
				>
					<i class="fa-solid fa-close text-xl" />
				</button>
			</div>
			<h4>Subscribe to get the access to listen all sounds</h4>

			<stripe-pricing-table
				pricing-table-id="prctbl_1MMMrFHM4ixiixxgpvO2HeTu"
				publishable-key="pk_test_51MKGVMHM4ixiixxgJOKAgByR2KNZVBCdhECdPrlS69jouagsS8AKyTGnivSGppFSTprb6gBoT8ONyYDbxupfhwAX000h8i0LD0"
			/>
		</div>
	</div>
</div>
