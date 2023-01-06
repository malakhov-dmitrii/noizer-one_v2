import type { Action } from 'svelte/types/runtime/action';

/** Dispatch event on click outside of node */
export const clickOutside: Action<HTMLElement, undefined> = (node) => {
	const handleClick = (event: MouseEvent) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
