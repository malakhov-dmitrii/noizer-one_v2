import { STRIPE_PRO_MONTHLY_PLAN_ID } from '$env/static/private';
import type { SubscriptionPlan } from '@/app';

export const freePlan: SubscriptionPlan = {
	name: 'Free',
	description:
		'The free plan is limits variant change feature. Upgrade to the PRO plan access all sound variants.',
	stripePriceId: ''
};

export const proPlan: SubscriptionPlan = {
	name: 'PRO',
	description: 'The PRO plan has no limits.',
	stripePriceId: STRIPE_PRO_MONTHLY_PLAN_ID || ''
};
