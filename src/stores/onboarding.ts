import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
// import mixpanel from 'mixpanel-browser';

export const onboardingStep = writable(
	browser ? +(localStorage.getItem('onboarding-basics') || '0') : 0
);

export const incrementOnboardingStep = () => {
	// mixpanel.people.increment('onboarding_step');

	onboardingStep.update((step) => {
		if (browser) localStorage.setItem('onboarding-basics', `${step + 1}`);
		return step + 1;
	});
};
