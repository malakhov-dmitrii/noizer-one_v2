<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { trackPixelEvent, trackPixelCustomEvent } from '@/lib/analytics';

	let pixelStatus = 'Checking...';
	let eventsLog: string[] = [];
	let showDebug = false;

	// Only show debug in development mode
	$: showDebug = dev;

	function checkPixelStatus() {
		if (typeof window === 'undefined') return 'Server rendering';

		if (window._fbq) {
			pixelStatus = 'Initialized ✅';
			return true;
		} else {
			pixelStatus = 'Not initialized ❌';
			return false;
		}
	}

	function testEvent() {
		trackPixelEvent('ViewContent', {
			content_name: 'Meta Pixel Debug',
			content_type: 'debug'
		});
		eventsLog = [...eventsLog, `[${new Date().toLocaleTimeString()}] Standard event: ViewContent`];
	}

	function testCustomEvent() {
		trackPixelCustomEvent('DebugTest', {
			timestamp: new Date().toISOString()
		});
		eventsLog = [...eventsLog, `[${new Date().toLocaleTimeString()}] Custom event: DebugTest`];
	}

	onMount(() => {
		checkPixelStatus();

		// Override Facebook Pixel fbq function to log events
		if (typeof window !== 'undefined' && window.fbq) {
			const originalFbq = window.fbq;
			window.fbq = function (event: string, eventName: string, params?: any) {
				const result = originalFbq(event, eventName, params);
				eventsLog = [
					...eventsLog,
					`[${new Date().toLocaleTimeString()}] ${event} | ${eventName} | ${JSON.stringify(
						params || {}
					)}`
				];
				return result;
			};
		}

		return () => {
			// Restore original fbq
			if (typeof window !== 'undefined' && window._fbq) {
				window.fbq = window._fbq;
			}
		};
	});
</script>

{#if showDebug}
	<div
		class="fixed bottom-4 right-4 bg-base-300 p-4 rounded-xl shadow-lg z-50 max-w-md"
		style="max-height: 80vh; overflow-y: auto;"
	>
		<div class="flex justify-between items-center mb-2">
			<h3 class="font-bold">Meta Pixel Debug</h3>
			<button class="btn btn-sm btn-circle" on:click={() => (showDebug = false)}>
				<i class="fa-solid fa-close" />
			</button>
		</div>

		<div class="mb-3">
			<div class="flex justify-between mb-2">
				<span
					>Status: <span class={pixelStatus.includes('✅') ? 'text-success' : 'text-error'}
						>{pixelStatus}</span
					></span
				>
				<span>ID: 1206528917775586</span>
			</div>

			<div class="flex gap-2">
				<button class="btn btn-sm btn-primary" on:click={testEvent}>Test Standard Event</button>
				<button class="btn btn-sm btn-secondary" on:click={testCustomEvent}
					>Test Custom Event</button
				>
			</div>
		</div>

		<div>
			<h4 class="font-semibold mb-1 text-sm">Event Log</h4>
			<div class="bg-base-100 p-2 rounded text-xs" style="max-height: 200px; overflow-y: auto;">
				{#if eventsLog.length === 0}
					<p class="opacity-70">No events logged yet</p>
				{:else}
					{#each eventsLog as event}
						<div class="mb-1">{event}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
