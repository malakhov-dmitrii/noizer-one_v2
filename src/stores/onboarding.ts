import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const onboardingStep = writable(
	browser ? +(localStorage.getItem('onboarding-basics') || '0') : 0
);

export const incrementOnboardingStep = () => {
	onboardingStep.update((step) => {
		if (browser) localStorage.setItem('onboarding-basics', `${step + 1}`);
		return step + 1;
	});
};
