<script lang="ts">
	const themes = [
		// { title: 'Main', theme: 'main' },
		{ title: '🌝  light', theme: 'light' },
		{ title: '🌚  dark', theme: 'dark' },
		{ title: '📝  Wireframe', theme: 'wireframe' },
		{ title: '🧁  cupcake', theme: 'cupcake' },
		{ title: '🐝  bumblebee', theme: 'bumblebee' },
		{ title: '✳️  Emerald', theme: 'emerald' },
		{ title: '🏢  Corporate', theme: 'corporate' },
		{ title: '🌃  synthwave', theme: 'synthwave' },
		{ title: '👴  retro', theme: 'retro' },
		{ title: '🤖  cyberpunk', theme: 'cyberpunk' },
		{ title: '🌸  valentine', theme: 'valentine' },
		{ title: '🎃  halloween', theme: 'halloween' },
		{ title: '🌷  garden', theme: 'garden' },
		{ title: '🌲  forest', theme: 'forest' },
		{ title: '🐟  aqua', theme: 'aqua' },
		{ title: '👓  lofi', theme: 'lofi' },
		{ title: '🖍  pastel', theme: 'pastel' },
		{ title: '🧚‍♀️  fantasy', theme: 'fantasy' },
		{ title: '🏴  black', theme: 'black' },
		{ title: '💎  luxury', theme: 'luxury' },
		{ title: '🧛‍♂️  dracula', theme: 'dracula' }
	];
</script>

<div class="dropdown dropdown-end">
	<div tabIndex={0} class="m-1 capitalize btn btn-ghost bg-opacity-80">
		<i class="fa-solid text-xl fa-palette" />
		<!-- {!compact && <span class="hidden ml-2 md:block">Change theme</span>} -->
	</div>
	<ul
		tabIndex={0}
		class="z-50 w-48 p-2 overflow-y-auto shadow menu dropdown-content compact bg-base-100 rounded-box"
	>
		{#each themes as i}
			<li>
				<a tabIndex={0} data-set-theme={i.theme} data-act-class="active" class="">
					{i.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
