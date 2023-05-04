// TODO: Fix this when we turn strict mode on.
import type { Profile, UserSubscriptionPlan } from '@/app';
import { freePlan, proPlan } from '@/config/subscriptions';
import { supabaseClient } from '@/lib/db';

export async function getUserSubscriptionPlan(userId: string): Promise<UserSubscriptionPlan> {
	const user = (await supabaseClient
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single()) as unknown as Profile;

	if (!user) {
		throw new Error('User not found');
	}

	// Check if user is on a pro plan.
	const isPro =
		!!(user.stripe_current_period_end && user.stripe_price_id) &&
		new Date(user.stripe_current_period_end)?.getTime() + 86_400_000 > Date.now();

	const plan = isPro ? proPlan : freePlan;

	return {
		...plan,
		...user,
		stripe_current_period_end: user.stripe_current_period_end
			? new Date(user.stripe_current_period_end)?.getTime()
			: null,
		isPro
	};
}
