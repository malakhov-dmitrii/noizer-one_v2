<script lang="ts">
	import SoundCard from '@/components/SoundCard.svelte';
	import ThemeChanger from '@/components/ThemeChanger.svelte';
	import sounds from '@/lib/sounds';
	import { playback, selectedVariantPerSound } from '@/stores/playback';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { themeChange } from 'theme-change';

	$: tried = Object.keys($selectedVariantPerSound).length > 0;

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
			title: 'Variant swtich',
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
		themeChange(false);
	});

	// $:{
	// 	// $selectedVariantPerSound.
	// }
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<div class="p-10">
	<h3 class="text-3xl font-bold">Noizer One</h3>
	<p>Live soundscapes right for you</p>
</div>

<div class="flex flex-col min-h-[70vh]">
	<div class="flex-1 h-full hero" id="start">
		<div class="text-center hero-content">
			<img
				src="/img/mainpage.jpg"
				alt="main"
				class="z-0 -top-12 object-cover h-[90%] transform absolute -skew-x-12 skew-y-6 shadow-md pointer-events-none opacity-20"
			/>
			<div class="z-10 max-w-3xl">
				<h1 class="mb-5 py-4 px-8 text-3xl font-light rounded-box bg-base-100">
					focus or relax with ambient sounds
					<br />
					build your perfect soundscape
				</h1>

				<p class="mt-4 font-light underline">
					Try this <span class="font-bold">~1.2%</span> of full experience first: 👇
				</p>

				<div
					class="flex flex-wrap border-2 border-black justify-center p-2 mt-6 -m-2 bg-base-100 rounded-box"
				>
					<div class="w-48 m-2">
						<SoundCard title="Cafe" variants={[sounds.filter((s) => s.sound === 'Cafe')[0]]} />
					</div>
					<div class="w-48 m-2">
						<SoundCard title="Stream" variants={[sounds.filter((s) => s.sound === 'Stream')[0]]} />
					</div>
					<div class="w-48 m-2">
						<SoundCard
							title="Bonfire"
							variants={[sounds.filter((s) => s.sound === 'Bonfire')[0]]}
						/>
					</div>
				</div>

				<div class="h-16 mt-8">
					{#if tried}
						<p
							transition:slide
							class="bg-base-100 py-4 px-8 border-2 border-black rounded-lg font-mono"
						>
							Sounds cool, right? <br /> Sign In and enjoy!
						</p>
					{/if}
				</div>

				<div class="mt-16">
					<a href="/">
						<button class="btn btn-primary btn-xl">Get started</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<div id="howItWorks" class="flex-1 max-w-3xl px-4 m-auto my-12 md:px-0">
	<div class="text-center">
		<div class="">
			<h2 class="mb-5 text-5xl font-bold">How it works</h2>
			<p>
				Compose your own soundscape - for work, study or relax.
				<br />
				To calm your baby or even pet. <br /> Just follow the flow
			</p>

			<div class="mt-12">
				<h2>For example, try this simple instruction:</h2>

				<ol class="max-w-2xl px-4 m-auto mt-4 text-left list-decimal">
					<li>
						<p class="text-lg font-bold">Select 1 location</p>
						<p>To set the mood and tempo</p>

						<div class="grid grid-flow-row grid-cols-2 gap-4 my-4 md:grid-cols-3">
							<SoundCard title="Cafe" variants={[sounds.filter((s) => s.sound === 'Cafe')[0]]} />
							<SoundCard
								title="Underground"
								variants={[sounds.filter((s) => s.sound === 'Underground')[0]]}
							/>
							<SoundCard
								title="Supermarket"
								variants={[sounds.filter((s) => s.sound === 'Supermarket')[0]]}
							/>
						</div>
						<!-- {soundsReady && (
                  )} -->
					</li>
					<li>
						<p class="text-lg font-bold">Select 1 background sound</p>
						<p>This will enrich your location - now imagine you`re there</p>

						<div class="grid grid-flow-row grid-cols-2 gap-4 my-4 md:grid-cols-3">
							<SoundCard
								title="Bonfire"
								variants={[sounds.filter((s) => s.sound === 'Bonfire')[0]]}
							/>
							<SoundCard
								title="Stream"
								variants={[sounds.filter((s) => s.sound === 'Stream')[0]]}
							/>
							<SoundCard
								title="Thunder"
								variants={[sounds.filter((s) => s.sound === 'Thunder')[0]]}
							/>
						</div>
					</li>
					<li>
						<p class="text-lg font-bold">Select 1 tweak</p>
						<p>Last step - tweak it to make it more real, immersive and unique</p>

						<div class="grid grid-flow-row grid-cols-2 gap-4 my-4 md:grid-cols-3">
							<SoundCard title="Rain" variants={[sounds.filter((s) => s.sound === 'Rain')[0]]} />
							<SoundCard title="Wind" variants={[sounds.filter((s) => s.sound === 'Wind')[0]]} />
							<SoundCard
								title="Keyboard"
								variants={[sounds.filter((s) => s.sound === 'Keyboard')[0]]}
							/>
						</div>
					</li>
				</ol>

				<div class="mt-20">
					<div class="divider">OR</div>

					<h2 class="mt-12 text-xl">
						Compose your own set with{' '}
						<span class="font-black">250+ sound variants</span>
					</h2>
					<p>You asked for more sounds - here we go</p>

					<p class="mt-12">
						We carefully handpicked new sounds - and for each of them we found in multiple variants
					</p>
					<p class="mt-12">
						<span class="font-semibold">Hundreds of hours</span> of manual selection, looping and testing
					</p>
				</div>

				<div class="mt-4">
					<a href="/">
						<button class="btn btn-primary">Get started</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<div id="features" class="flex-1 max-w-3xl px-4 m-auto my-12 md:px-0">
	<div class="text-center">
		<div class="">
			<h2 class="mb-5 text-5xl font-bold">Features list</h2>

			<div class="space-y-6">
				{#each features as feature}
					<div
						class="flex items-center justify-between flex-col sm:flex-row sm:even:flex-row-reverse border-black border-2 rounded-lg py-12 px-8 md:px-16"
					>
						<div class="flex-1">
							<i class={`fa-solid text-9xl ${feature.icon}`} />
						</div>

						<div class="divider lg:divider-horizontal" />
						<div class="flex-1 text-left">
							{#each feature.tags ?? [] as tag}
								<span class="px-2 py-1 mr-2 text-xs font-bold text-white bg-blue-500 rounded"
									>{tag}</span
								>
							{/each}

							<h2 class="text-2xl font-medium">{feature.title}</h2>
							<p class="mt-2">{feature.description}</p>
						</div>
					</div>
				{/each}

				<div
					class="flex items-center justify-between flex-col sm:flex-row sm:even:flex-row-reverse border-black border-2 rounded-lg py-12 px-8 md:px-16"
				>
					<div class="flex-1">
						<i class={`fa-solid text-9xl fa-wand-magic-sparkles`} />
					</div>

					<div class="divider lg:divider-horizontal" />
					<div class="flex-1 text-left">
						<h2 class="text-2xl font-medium">20 themes</h2>
						<p class="mt-2">
							Light, dark, black, cyberpunk, whatever! Try yourself now:
							<ThemeChanger />
						</p>
					</div>
				</div>

				<h3>
					<span class="text-2xl font-bold">And more...</span>
					<span class="text-lg"> (coming soon)</span>
				</h3>

				<div class="mt-4 flex gap-4 justify-center">
					<a href="/">
						<button class="btn btn-primary">Get started</button>
					</a>
					<a href="https://noizer-one.canny.io/feature-requests" class="">
						<button class="btn btn-primary btn-outline">View our roadmap</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="p-2">
	<div class="divider" />
</div>

<div>
	<h2 class="text-center text-3xl font-bold mb-4">Pricing</h2>
	<stripe-pricing-table
		pricing-table-id="prctbl_1MMMrFHM4ixiixxgpvO2HeTu"
		publishable-key="pk_test_51MKGVMHM4ixiixxgJOKAgByR2KNZVBCdhECdPrlS69jouagsS8AKyTGnivSGppFSTprb6gBoT8ONyYDbxupfhwAX000h8i0LD0"
	/>
</div>

<div class="p-2">
	<footer
		id="footer"
		class="p-10 rounded-box footer bg-base-100 text-base-content flex justify-between flex-wrap"
	>
		<div>
			<h3 class="text-3xl font-bold">Noizer One</h3>
			<p>Live soundscapes right for you</p>
		</div>
		<div class="flex gap-2 text-xl">
			<a
				href="https://discord.gg/mZdxNGp8GW"
				class="link"
				rel="noopener noreferrer"
				target="_blank"
			>
				<i class="fa-brands fa-discord" />
				Join our Discord
			</a>
		</div>
	</footer>
</div>
