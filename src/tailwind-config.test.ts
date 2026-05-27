import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

const require = createRequire(import.meta.url);

type TailwindConfig = {
	plugins: unknown[];
};

const tailwindConfig = require('../tailwind.config.cjs') as TailwindConfig;

describe('tailwind config', () => {
	test('loads daisyUI as a Tailwind plugin function', () => {
		const daisyuiPlugin = tailwindConfig.plugins.at(-1);

		expect(typeof daisyuiPlugin).toBe('function');
	});
});
