import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import * as amplitude from '@amplitude/analytics-browser';

export const onboardingStep = writable(
	browser ? +(localStorage.getItem('onboarding-basics') || '0') : 0
);

export const incrementOnboardingStep = () => {
	onboardingStep.update((step) => {
		amplitude.track('onboarding_step', { step: step + 1 });
		if (browser) localStorage.setItem('onboarding-basics', `${step + 1}`);
		return step + 1;
	});
};
