<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { trackPixelEvent, trackPixelCustomEvent } from '@/lib/analytics';

	export let hasActiveSubscription: boolean = false;

	const lemonsqueezyHref = dev
		? 'https://noizer-one.lemonsqueezy.com/buy/5da8b314-8f3c-4818-a14b-828b0fde9164?embed=1'
		: 'https://noizer-one.lemonsqueezy.com/buy/ba8aa9fe-b088-44e7-a9de-2478e1c95ade?embed=1&enabled=335134';

	onMount(() => {
		if (!hasActiveSubscription) {
			const script = document.createElement('script');
			script.src = 'https://assets.lemonsqueezy.com/lemon.js';
			script.defer = true;
			document.body.appendChild(script);

			// Track subscription banner view
			trackPixelCustomEvent('subscription_banner_view');

			// Setup LemonSqueezy checkout event listeners
			window.addEventListener('lemonsqueezy:checkout:opened', () => {
				trackPixelEvent('InitiateCheckout', {
					content_type: 'subscription',
					content_name: 'NoizerOne Premium'
				});
			});

			// Track when a purchase is completed
			window.addEventListener('lemonsqueezy:checkout:completed', (event) => {
				// @ts-ignore - Event detail type
				const detail = event.detail;
				const amount = detail?.meta?.total_price || 24.0;

				trackPixelEvent('Purchase', {
					value: amount,
					currency: 'USD',
					content_type: 'subscription',
					content_name: 'NoizerOne Premium'
				});

				trackPixelCustomEvent('subscription_purchased', {
					price: amount,
					currency: 'USD'
				});
			});

			return () => {
				document.body.removeChild(script);
				window.removeEventListener('lemonsqueezy:checkout:opened', () => {});
				window.removeEventListener('lemonsqueezy:checkout:completed', () => {});
			};
		}
	});

	function handleBannerClick() {
		trackPixelCustomEvent('subscription_banner_click');
	}
</script>

{#if !hasActiveSubscription}
	<a
		href={lemonsqueezyHref}
		class="lemonsqueezy-button w-full block text-center py-4 cursor-pointer bg-primary text-primary-content font-bold"
		on:click={handleBannerClick}
	>
		<span class="py-1 bg-primary-content rounded-md px-2 text-primary">LIFETIME DEAL: 24$ </span>
		Unlock 200+ sounds and advanced features!
	</a>
{/if}
