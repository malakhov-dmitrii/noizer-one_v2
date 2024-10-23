<script lang="ts">
	import { dev } from '$app/environment';
	import { auth } from '@/stores/auth';
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
	<div class="bg-white rounded-lg max-w-md w-full relative animate-in fade-in zoom-in duration-300">
		<button
			on:click={() => {
				$auth.subscriptionModal = !$auth.subscriptionModal;
			}}
			class="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
		>
			<i class="fa-solid fa-close text-xl" />
		</button>

		<div
			class="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2"
		>
			PRO Feature
		</div>

		<div class="p-6 pt-8">
			<h2 class="text-2xl font-bold text-center mb-2">Unlock the Full Experience</h2>

			<p class="text-gray-600 text-center mb-6">
				Subscribe to get access to all sounds and features
			</p>

			<div class="space-y-3 mb-6">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<span class="text-indigo-600 text-lg">🎵</span>
					</div>
					<p class="text-gray-700">200+ premium soundscapes</p>
				</div>
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<span class="text-indigo-600 text-lg">💾</span>
					</div>
					<p class="text-gray-700">Save unlimited mixes</p>
				</div>
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<span class="text-indigo-600 text-lg">🎚️</span>
					</div>
					<p class="text-gray-700">Advanced mixing controls</p>
				</div>
			</div>

			<div class="text-center mb-6">
				<div class="inline-block">
					<span class="text-3xl font-bold text-gray-900">$8.18</span>
					<span class="text-gray-500">/month</span>
				</div>
			</div>

			<button
				class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
			>
				Get Premium Access
			</button>

			<p class="text-sm text-gray-500 text-center mt-4">
				30-day money-back guarantee. Cancel anytime.
			</p>
		</div>
	</div>
</div>
