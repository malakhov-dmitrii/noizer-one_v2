import initialPlaylists from '@/lib/playlists';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Load saved playlists from localStorage and combine with initial playlists
function getInitialPlaylists() {
	let savedPlaylists = [];
	if (browser) {
		try {
			savedPlaylists = JSON.parse(localStorage.getItem('noizer_playlists') || '[]');
		} catch (error) {
			console.warn('Failed to load playlists from localStorage:', error);
		}
	}
	return [...initialPlaylists, ...savedPlaylists];
}

export const playlists = writable(getInitialPlaylists());
