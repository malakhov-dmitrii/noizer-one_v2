// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	/// <reference types="@sveltejs/kit" />

	// interface Locals {}
	interface PageData {
		session: any;
		subscription: any;
		lemonSqueezySubscription: any;
		customerPortalUrl: string | null;
		playlists: any[];
	}
	// interface Error {}
	// interface Platform {}
}
