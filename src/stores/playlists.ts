import initialPlaylists from '@/lib/playlists';
import { writable } from 'svelte/store';

export const playlists = writable(initialPlaylists);
