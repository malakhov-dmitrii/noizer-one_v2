// Facebook Pixel utility functions
type FBEvent =
	| 'PageView'
	| 'Lead'
	| 'CompleteRegistration'
	| 'Subscribe'
	| 'StartTrial'
	| 'Purchase'
	| 'Contact'
	| 'AddToCart'
	| 'InitiateCheckout'
	| 'ViewContent'
	| 'AddPaymentInfo'
	| 'CustomizeProduct'
	| 'Search';

// Type definition for the global fbq function
declare global {
	interface Window {
		fbq: (event: string, eventName: FBEvent | string, params?: Record<string, any>) => void;
		_fbq: any;
	}
}

/**
 * Track a standard Facebook Pixel event
 * @param eventName - The name of the event to track
 * @param params - Optional parameters to include with the event
 */
export function trackPixelEvent(eventName: FBEvent, params?: Record<string, any>): void {
	if (typeof window !== 'undefined' && window.fbq) {
		window.fbq('track', eventName, params);
		console.log(`[Meta Pixel] Tracked event: ${eventName}`, params || '');
	} else {
		console.warn(`[Meta Pixel] Failed to track event: ${eventName} - fbq not available`);
	}
}

/**
 * Track a custom Facebook Pixel event
 * @param eventName - The name of the custom event to track
 * @param params - Optional parameters to include with the event
 */
export function trackPixelCustomEvent(eventName: string, params?: Record<string, any>): void {
	if (typeof window !== 'undefined' && window.fbq) {
		window.fbq('trackCustom', eventName, params);
		console.log(`[Meta Pixel] Tracked custom event: ${eventName}`, params || '');
	} else {
		console.warn(`[Meta Pixel] Failed to track custom event: ${eventName} - fbq not available`);
	}
}

// User Registration/Authentication events
export function trackSignUp(method: 'email' | 'google', email?: string): void {
	trackPixelEvent('CompleteRegistration', {
		content_name: 'User Registration',
		method,
		email: email ? email.substring(0, 5) + '...' : undefined // Only send truncated email for privacy
	});
}

export function trackLoginAttempt(method: 'email' | 'google'): void {
	trackPixelCustomEvent('LoginAttempt', { method });
}

export function trackLoginSuccess(method: 'email' | 'google'): void {
	trackPixelCustomEvent('LoginSuccess', { method });
}

// Subscription/Purchase events
export function trackSubscription(value: number, currency = 'USD'): void {
	trackPixelEvent('Subscribe', {
		value,
		currency,
		predicted_ltv: value * 1.5 // Estimated lifetime value
	});

	// Also track as a purchase
	trackPixelEvent('Purchase', {
		value,
		currency,
		content_type: 'product',
		content_name: 'NoizerOne Premium Subscription'
	});
}

// Product engagement events
export function trackSoundPlay(soundName: string, category: string): void {
	trackPixelCustomEvent('SoundPlay', {
		sound_name: soundName,
		category
	});
}

export function trackPlaylistCreate(playlistName: string, soundsCount: number): void {
	trackPixelCustomEvent('PlaylistCreate', {
		playlist_name: playlistName,
		sounds_count: soundsCount
	});
}

export function trackFeatureEngagement(featureName: string): void {
	trackPixelCustomEvent('FeatureEngagement', {
		feature_name: featureName
	});
}
