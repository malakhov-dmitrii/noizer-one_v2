import { writable } from 'svelte/store';

interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	duration: number;
}

const toasts = writable<Toast[]>([]);

export function toast(
	message: string,
	type: 'success' | 'error' | 'info' = 'info',
	duration = 5000
) {
	const id = Math.random().toString(36).slice(2);
	const toast = { id, message, type, duration };

	toasts.update((toasts) => [...toasts, toast]);

	setTimeout(() => {
		toasts.update((toasts) => toasts.filter((t) => t.id !== id));
	}, duration);
}

export default toasts;

export const closeToast = (id: string) => {
	toasts.update((toasts) => toasts.filter((t) => t.id !== id));
};
