// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	/// <reference types="@sveltejs/kit" />

	// See https://kit.svelte.dev/docs/types#app
	// for information about these interfaces
	// and what to do when importing types
	interface Supabase {
		Database: import('./lib/database.types').Database;
		SchemaName: 'public';
	}

	// interface Locals {}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}
	// interface Error {}
	// interface Platform {}

	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

export type SubscriptionPlan = {
	name: string;
	description: string;
	stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
	Pick<Profile, 'stripe_customer_id' | 'stripe_subscription_id'> & {
		stripe_current_period_end: number;
		isPro: boolean;
	};
export type Profile = Database['public']['Tables']['profiles']['Row'];
