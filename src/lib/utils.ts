import type { FileItem, GroupedSounds } from '@/stores/playback';

export const listSounds = (sounds: FileItem[]): GroupedSounds =>
	sounds.reduce((result, item) => {
		// Get app object corresponding to current item from result (or insert if not present)
		const group = (result[item.group] = result[item.group] || {});

		// Get type array corresponding to current item from app object (or insert if not present)
		const sound = (group[item.sound] = group[item.sound] || []);

		// Add current item to current type array
		sound.push(item);

		// Return the result object for this iteration
		return result;
	}, {});

export const cx = (...classes: (string | undefined)[]) => {
	return classes.filter(Boolean).join(' ');
};
