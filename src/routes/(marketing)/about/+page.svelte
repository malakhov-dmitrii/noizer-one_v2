<script lang="ts">
	import SoundCard from '@/components/SoundCard.svelte';
	import ThemeChanger from '@/components/ThemeChanger.svelte';
	import sounds from '@/lib/sounds';
	import { playback, selectedVariantPerSound } from '@/stores/playback';
	import { auth } from '@/stores/auth';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { themeChange } from 'theme-change';
	import * as amplitude from '@amplitude/analytics-browser';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';

	$: tried = Object.keys($selectedVariantPerSound).length > 0;

	// Default fallback image
	const fallbackImage = '/img/mainpage.jpg';
	let mixerImage = '/img/mixer-screenshot.png';
	let presetsImage = '/img/playlists-screenshot.png';

	// Handle image loading errors
	function handleImageError(imageVar: string): void {
		if (imageVar === 'mixer') {
			mixerImage = fallbackImage;
		} else if (imageVar === 'presets') {
			presetsImage = fallbackImage;
		} else if (imageVar === 'logo') {
			// Handle logo error
		}
	}

	const features: {
		title: string;
		description: string;
		tags?: string[];
		icon: string;
	}[] = [
		{
			title: 'Rich library of ambient sounds with multiple variations',
			description:
				'We collected more than 250 variants for more than 50 different sounds, so you can compose soundscape for your own vibe',
			tags: ['users requested'],
			icon: 'fa-album-collection'
		},
		{
			title: 'Variant switch',
			description:
				'If you want to adjust some sound to your mood - you have number of variations for almost each one',
			icon: 'fa-dice'
		},
		{
			title: 'Nice groups and search',
			description:
				'You dont need to search anything through one big list - we grouped all sounds so you can easily find anything',
			icon: 'fa-object-group',
			tags: ['users requested']
		},
		//   {
		//     title: "Small pomodoro timer",
		//     description: "It may help you to organize your work",
		//     tags: <div class="badge badge-primary">users requested</div>,
		//     icon: faTomato,
		//   },
		{
			title: 'Sweeping',
			description:
				'This will change the volume of your sounds over time to make your soundscape a little bit more dynamic.',
			// tags: <div class="badge badge-primary">users requested</div>,
			icon: 'fa-waveform'
		},
		{
			title: 'Simple shortcuts',
			description:
				'Perform better, do common actions faster - you dont event need to touch the mouse',
			icon: 'fa-keyboard'
		},
		{
			title: 'Mobile Apps',
			description: 'Available on iOS and Android. Most frequently asked feature',
			tags: ['users requested', 'beta'],
			// @ts-ignore
			icon: 'fa-mobile-alt'
		}
		//   {
		//     title: "Spatial sounds",
		//     description:
		//       "Change the relative position of your sounds to make soundscape even more immersive",
		//     tags: (
		//       <>
		//         <div class="badge badge-secondary">coming soon</div>
		//         <div class="ml-2 badge badge-primary">users requested</div>
		//       </>
		//     ),
		//     // @ts-ignore
		//     icon: fa360Degrees,
		//   },
	];

	onMount(() => {
		amplitude.init(PUBLIC_AMPLITUDE_API_KEY);

		themeChange(false);
	});
</script>

<!-- Hero Section -->
<div class="relative bg-white">
	<!-- Top Purple Banner -->
	<div class="w-full bg-[#7e3af2] text-white py-2 px-4 text-center font-semibold">
		LIFETIME DEAL: $24 — Unlock 200+ sounds and advanced features!
	</div>

	<!-- Header/Nav -->
	<div class="border-b bg-base-100 py-2 px-4">
		<div class="container mx-auto flex items-center justify-between">
			<div class="flex items-center">
				<img
					src="/img/logo-2.png"
					alt="Noizer One Logo"
					class="h-8 w-8 mr-2"
					on:error={() => handleImageError('logo')}
				/>
				<div>
					<div class="font-bold">Noizer One</div>
					<div class="text-xs">Live soundscapes right for you</div>
				</div>
			</div>
			<div>
				<button
					class="btn btn-sm btn-primary"
					on:click={() => {
						$auth.modal = true;
					}}>Sign In</button
				>
			</div>
		</div>
	</div>

	<!-- Main Hero Content -->
	<div class="container mx-auto px-4 py-10 text-center">
		<h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
			Focus, Relax, and Sleep Better—<br />All with One App
		</h1>
		<h2 class="text-xl md:text-2xl font-semibold mb-8 text-[#7e3af2]">
			Get Lifetime Access to 200+ Ambient Sounds & Advanced Mixing<br />for Just $24
		</h2>

		<div class="max-w-2xl mx-auto mb-8">
			<p>
				Struggling with distractions or stress? Noizer One gives you <strong>instant access</strong>
				to hundreds of high-quality sounds—like cafés, campfires, rainstorms, and more—so you can create
				the <strong>perfect audio environment</strong> for any task.
			</p>
			<p class="mt-4">
				<strong>Pay once</strong> and enjoy a lifetime of focus, relaxation, and better sleep.
			</p>
		</div>

		<a href="#pricing">
			<button class="btn btn-primary btn-lg">Unlock Lifetime Deal Now</button>
		</a>
	</div>

	<!-- Sound Cards -->
	<div class="container mx-auto px-4 pb-10">
		<div class="flex justify-around flex-wrap max-w-4xl mx-auto">
			<div class="w-[30%]">
				<SoundCard title="Cafe" variants={[sounds.filter((s) => s.sound === 'Cafe')[0]]} />
			</div>
			<div class="w-[30%]">
				<SoundCard title="Rain" variants={[sounds.filter((s) => s.sound === 'Rain')[0]]} />
			</div>
			<div class="w-[30%]">
				<SoundCard title="Bonfire" variants={[sounds.filter((s) => s.sound === 'Bonfire')[0]]} />
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Variant Switching Feature Highlight -->
<div class="py-12 bg-base-200">
	<div class="max-w-5xl mx-auto px-4">
		<div class="text-center mb-10">
			<h2 class="text-3xl font-bold mb-4">Choose from Multiple Variants for Each Sound</h2>
			<p class="text-lg max-w-3xl mx-auto">
				Don't settle for just one version of each sound. Noizer One gives you multiple variants to
				find the perfect match for your mood or environment.
			</p>
		</div>

		<div class="flex flex-col md:flex-row items-center justify-between gap-8">
			<div class="md:w-1/2">
				<img
					src="/img/variants.png"
					alt="Variant Switching Demonstration"
					class="rounded-lg shadow-lg border-2 border-[#7e3af2] w-full"
					on:error={() => {
						// Fallback to illustrated example if image doesn't exist
					}}
				/>
			</div>

			<div class="md:w-1/2 space-y-6">
				<div class="border-2 border-[#7e3af2] rounded-lg p-6 bg-base-100">
					<h3 class="text-xl font-bold flex items-center">
						<i class="fa-solid fa-dice text-[#7e3af2] mr-3 text-2xl" />
						Multiple Sound Variations
					</h3>
					<p class="mt-2">
						Each sound in Noizer One comes with multiple carefully curated variants - from gentle
						café murmurs to bustling coffee shops, from light drizzle to heavy downpour.
					</p>
				</div>

				<div class="border-2 border-[#7e3af2] rounded-lg p-6 bg-base-100">
					<h3 class="text-xl font-bold flex items-center">
						<i class="fa-solid fa-sliders text-[#7e3af2] mr-3 text-2xl" />
						One-Click Switching
					</h3>
					<p class="mt-2">
						Simply click to cycle through variants or open the selection panel to preview and choose
						exactly the sound variation that fits your mood.
					</p>
				</div>

				<div class="border-2 border-[#7e3af2] rounded-lg p-6 bg-base-100">
					<h3 class="text-xl font-bold flex items-center">
						<i class="fa-solid fa-fingerprint text-[#7e3af2] mr-3 text-2xl" />
						Personalized Experience
					</h3>
					<p class="mt-2">
						Create truly unique soundscapes by mixing different variants of each sound type - the
						possibilities are endless!
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Social Proof -->
<div class="py-12 bg-base-100">
	<div class="max-w-3xl mx-auto px-4">
		<div class="grid md:grid-cols-2 gap-6">
			<div class="bg-base-200 p-6 rounded-lg shadow-sm">
				<p class="italic">
					"I've doubled my productivity since I started using Noizer One. The customized mixes keep
					me in flow all day!"
				</p>
				<p class="font-bold mt-4">– Adrian M., Software Developer</p>
			</div>
			<div class="bg-base-200 p-6 rounded-lg shadow-sm">
				<p class="italic">
					"My evenings are calmer and I'm sleeping like a baby again. So worth the one-time price."
				</p>
				<p class="font-bold mt-4">– Catherine L., Online Teacher</p>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- What is Noizer One -->
<div id="about" class="py-12 bg-base-100">
	<div class="max-w-3xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-8">What Is Noizer One?</h2>

		<p class="text-lg mb-8 text-center">
			Noizer One is an all-in-one <strong>ambient sound mixer</strong> that puts you in control of
			your environment. Whether you're fighting office noise, studying late at night, or winding
			down before bed, our growing library of <strong>200+ immersive sounds</strong> helps you quickly
			craft the vibe you need—no clunky playlists, no endless searching.
		</p>

		<div class="grid md:grid-cols-2 gap-6 mt-10">
			<div class="border-2 border-black rounded-lg p-6 flex flex-col items-center text-center">
				<i class="fa-solid fa-music text-4xl mb-4" />
				<h3 class="text-xl font-semibold">200+ Sounds, 6 Categories</h3>
				<p>Nature, locations, background noises, color noise, ASMR triggers, and more.</p>
			</div>

			<div class="border-2 border-black rounded-lg p-6 flex flex-col items-center text-center">
				<i class="fa-solid fa-sliders text-4xl mb-4" />
				<h3 class="text-xl font-semibold">Layer & Mix</h3>
				<p>
					Combine multiple sounds, adjust individual volumes, and even randomize for fresh variety.
				</p>
			</div>

			<div class="border-2 border-black rounded-lg p-6 flex flex-col items-center text-center">
				<i class="fa-solid fa-waveform text-4xl mb-4" />
				<h3 class="text-xl font-semibold">Smooth Volume Tweens</h3>
				<p>Let sounds flow seamlessly with our 'Tween volume' feature—no jarring transitions.</p>
			</div>

			<div class="border-2 border-black rounded-lg p-6 flex flex-col items-center text-center">
				<i class="fa-solid fa-bookmark text-4xl mb-4" />
				<h3 class="text-xl font-semibold">Save Presets</h3>
				<p>
					Create and share your favorite mixes—switch between "Focus: Cafe" and "Sleep: Rainstorm"
					instantly.
				</p>
			</div>

			<div
				class="border-2 border-black rounded-lg p-6 flex flex-col items-center text-center col-span-full"
			>
				<i class="fa-solid fa-infinity text-4xl mb-4" />
				<h3 class="text-xl font-semibold">No Monthly Fees</h3>
				<p>One-time payment unlocks everything, forever.</p>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Benefits / Use Cases -->
<div id="benefits" class="py-12 bg-base-200">
	<div class="max-w-3xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-12">Why You'll Love Noizer One</h2>

		<div class="space-y-8">
			<div
				class="flex flex-col md:flex-row items-center bg-base-100 rounded-lg p-6 border-2 border-black"
			>
				<div class="md:w-1/4 flex justify-center mb-4 md:mb-0">
					<i class="fa-solid fa-briefcase text-6xl" />
				</div>
				<div class="md:w-3/4">
					<h3 class="text-2xl font-semibold mb-2">Stay Focused at Work</h3>
					<p>
						Drown out background chatter and busy offices with custom-blended white noise, café
						murmurs, or light instrumental loops. Perfect for coding, writing, or any deep-focus
						task.
					</p>
				</div>
			</div>

			<div
				class="flex flex-col md:flex-row-reverse items-center bg-base-100 rounded-lg p-6 border-2 border-black"
			>
				<div class="md:w-1/4 flex justify-center mb-4 md:mb-0">
					<i class="fa-solid fa-cloud text-6xl" />
				</div>
				<div class="md:w-3/4">
					<h3 class="text-2xl font-semibold mb-2">Relax and De-Stress</h3>
					<p>
						Lower your stress levels by immersing yourself in soothing nature sounds—like a gentle
						stream, waves on the shore, or a crackling bonfire.
					</p>
				</div>
			</div>

			<div
				class="flex flex-col md:flex-row items-center bg-base-100 rounded-lg p-6 border-2 border-black"
			>
				<div class="md:w-1/4 flex justify-center mb-4 md:mb-0">
					<i class="fa-solid fa-moon text-6xl" />
				</div>
				<div class="md:w-3/4">
					<h3 class="text-2xl font-semibold mb-2">Sleep Better</h3>
					<p>
						Drift off faster with soft rain on the roof or a distant rolling thunder. Block out
						noisy neighbors or nighttime distractions, and wake up refreshed.
					</p>
				</div>
			</div>

			<div
				class="flex flex-col md:flex-row-reverse items-center bg-base-100 rounded-lg p-6 border-2 border-black"
			>
				<div class="md:w-1/4 flex justify-center mb-4 md:mb-0">
					<i class="fa-solid fa-mobile-alt text-6xl" />
				</div>
				<div class="md:w-3/4">
					<h3 class="text-2xl font-semibold mb-2">For Any Time, Anywhere</h3>
					<p>
						Accessible on web and mobile (iOS/Android). Switch between devices seamlessly and keep
						your saved presets in sync.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Lifetime Deal -->
<div id="pricing" class="py-12 bg-base-100">
	<div class="max-w-3xl mx-auto px-4 text-center">
		<h2 class="text-4xl font-bold mb-8">Limited-Time Lifetime Deal ($24)</h2>

		<div class="bg-base-200 p-8 rounded-lg border-2 border-primary mb-8">
			<div class="grid md:grid-cols-2 gap-6 mb-8">
				<div class="flex flex-col items-center">
					<i class="fa-solid fa-credit-card text-4xl mb-4" />
					<h3 class="text-xl font-semibold">One-Time Payment</h3>
					<p>No recurring subscriptions, no hidden fees.</p>
				</div>

				<div class="flex flex-col items-center">
					<i class="fa-solid fa-bolt text-4xl mb-4" />
					<h3 class="text-xl font-semibold">Instant Access</h3>
					<p>Unlock all current sounds + future additions at no extra cost.</p>
				</div>

				<div class="flex flex-col items-center">
					<i class="fa-solid fa-arrows-rotate text-4xl mb-4" />
					<h3 class="text-xl font-semibold">Free Updates</h3>
					<p>Enjoy new features and expansions as we grow—forever.</p>
				</div>

				<div class="flex flex-col items-center">
					<i class="fa-solid fa-users text-4xl mb-4" />
					<h3 class="text-xl font-semibold">Community-Driven</h3>
					<p>Help shape Noizer One by voting on features, requesting new sounds, and more.</p>
				</div>
			</div>

			<a href="/">
				<button class="btn btn-primary btn-lg">Get Noizer One for $24—Lifetime Access</button>
			</a>

			<p class="mt-4 text-sm font-medium">Grab this lifetime deal before it's gone!</p>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Visual Demo -->
<div id="demo" class="py-12 bg-base-200">
	<div class="max-w-3xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-8">See It in Action</h2>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-base-100 rounded-lg overflow-hidden shadow-md">
				<img
					src={mixerImage}
					alt="Mixer Screenshot"
					class="w-full"
					on:error={() => handleImageError('mixer')}
				/>
				<p class="p-4 text-center">Adjust volumes for each layer</p>
			</div>

			<div class="bg-base-100 rounded-lg overflow-hidden shadow-md">
				<img
					src={presetsImage}
					alt="Presets Screenshot"
					class="w-full"
					on:error={() => handleImageError('presets')}
				/>
				<p class="p-4 text-center">One-click randomize for fresh combos</p>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- FAQ Section -->
<div id="faq" class="py-12 bg-base-100">
	<div class="max-w-3xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

		<div class="space-y-6">
			<div class="collapse collapse-arrow border-2 border-black rounded-lg">
				<input type="checkbox" id="faq-1" class="peer" />
				<label for="faq-1" class="collapse-title text-xl font-medium cursor-pointer"
					>Is it really just $24 one-time?</label
				>
				<div class="collapse-content">
					<p>
						Absolutely. You pay <strong>once</strong> and unlock every feature—no monthly subscription.
					</p>
				</div>
			</div>

			<div class="collapse collapse-arrow border-2 border-black rounded-lg">
				<input type="checkbox" id="faq-2" class="peer" />
				<label for="faq-2" class="collapse-title text-xl font-medium cursor-pointer"
					>Which devices can I use it on?</label
				>
				<div class="collapse-content">
					<p>
						Noizer One currently works on <strong>web</strong>, iOS, and Android apps will be coming
						soon.
					</p>
				</div>
			</div>

			<div class="collapse collapse-arrow border-2 border-black rounded-lg">
				<input type="checkbox" id="faq-3" class="peer" />
				<label for="faq-3" class="collapse-title text-xl font-medium cursor-pointer"
					>How do I get new sounds or updates?</label
				>
				<div class="collapse-content">
					<p>
						All future feature upgrades and new sounds are <strong>included</strong> once you unlock
						the Lifetime Deal.
					</p>
				</div>
			</div>

			<div class="collapse collapse-arrow border-2 border-black rounded-lg">
				<input type="checkbox" id="faq-4" class="peer" />
				<label for="faq-4" class="collapse-title text-xl font-medium cursor-pointer"
					>Can I share my presets?</label
				>
				<div class="collapse-content">
					<p>
						Yes! You can copy a link and share your custom soundscape with friends or coworkers
						instantly.
					</p>
				</div>
			</div>

			<div class="collapse collapse-arrow border-2 border-black rounded-lg">
				<input type="checkbox" id="faq-5" class="peer" />
				<label for="faq-5" class="collapse-title text-xl font-medium cursor-pointer"
					>What if I have more questions?</label
				>
				<div class="collapse-content">
					<p>
						Reach out to our friendly support team at <a
							href="mailto:mitia2022@gmail.com"
							class="link">email</a
						>,
						<a
							href="https://discord.gg/mZdxNGp8GW"
							class="link"
							rel="noopener noreferrer"
							target="_blank">Discord</a
						> or chat with us on the website. We're here to help.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<!-- Final CTA -->
<div class="py-16 bg-base-200">
	<div class="max-w-3xl mx-auto px-4 text-center">
		<h2 class="text-4xl font-bold mb-8">Take Control of Your Sound Environment Today</h2>

		<p class="text-lg mb-12">
			Don't let noisy distractions or stressful silence hold you back. Noizer One is your easy,
			affordable way to <strong>stay focused</strong>, <strong>sleep better</strong>, and
			<strong>relax on demand</strong>. Join thousands of happy users who've discovered the power of
			personalized ambient sound.
		</p>

		<a href="#pricing">
			<button class="btn btn-primary btn-lg">Unlock Lifetime Access for $24</button>
		</a>

		<p class="mt-6 text-sm">
			<strong>Money-Back Guarantee:</strong> If you're not satisfied within 7 days, let us know and we'll
			make it right.
		</p>
	</div>
</div>

<!-- Footer -->
<footer class="p-10 footer bg-base-100 text-base-content border-t">
	<div>
		<h3 class="text-3xl font-bold">Noizer One</h3>
		<p>Live soundscapes right for you</p>
		<p class="mt-4">
			<a href="/docs/privacy.pdf" class="link">Privacy Policy</a> &bull;
			<a href="/docs/tos.pdf" class="link">Terms of Service</a>
		</p>
	</div>
	<div>
		<span class="footer-title">Community</span>
		<a href="https://discord.gg/mZdxNGp8GW" class="link" rel="noopener noreferrer" target="_blank">
			<i class="fa-brands fa-discord mr-2" />Join Discord
		</a>
		<a href="mailto:support@NoizerOne.com" class="link">
			<i class="fa-solid fa-envelope mr-2" />Contact Support
		</a>
	</div>
	<div>
		<span class="footer-title">Theme</span>
		<ThemeChanger />
	</div>
</footer>
