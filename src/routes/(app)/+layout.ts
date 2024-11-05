import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const load = async () => {
	if (browser) {
		posthog.init('phc_wnxpq76WlBx9sJ1rsF411RfLifcb2j2pZmACjrTXGug', {
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'identified_only',
			capture_pageview: false,
			capture_pageleave: false
		});
	}
	return;
};
