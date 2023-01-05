import { readable, writable } from 'svelte/store';

export const count = writable(0);

export const time = readable(new Date(), (set) => {
	const i = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => {
		clearInterval(i);
	};
});
