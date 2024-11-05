import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const load = async () => {
	if (browser) {
		posthog.init('phc_wnxpq76WlBx9sJ1rsF411RfLifcb2j2pZmACjrTXGug', {
			ui_host: 'https://eu.i.posthog.com',
			api_host: 'https://noizer.one/ingest',
			person_profiles: 'always',
			capture_pageview: true,
			capture_pageleave: true
		});
	}
	return;
};
