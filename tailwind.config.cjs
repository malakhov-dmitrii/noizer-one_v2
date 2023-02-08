/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}'
		// './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			// colors: {
			// 	primary: {
			// 		50: '#f0f9ff',
			// 		100: '#e0f2fe',
			// 		200: '#bae5fd',
			// 		300: '#7dd1fc',
			// 		400: '#38bbf8',
			// 		500: '#0ea2e9',
			// 		600: '#0288d1',
			// 		700: '#0367a1',
			// 		800: '#075785',
			// 		900: '#0c496e'
			// 	}
			// }
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio'),
		// require('flowbite/plugin'),
		require('daisyui')
	],
	darkMode: 'class',
	daisyui: {
		// themes: false
	}
};
