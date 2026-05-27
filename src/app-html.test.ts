import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const appHtml = readFileSync(resolve(process.cwd(), 'src/app.html'), 'utf8');

const getMetaTag = (name: string) =>
	appHtml.match(new RegExp(`<meta\\s+[^>]*name="${name}"[^>]*>`, 's'))?.[0] ?? '';

describe('app.html', () => {
	test('defines canonical and social sharing metadata', () => {
		expect(appHtml).toContain('<link rel="canonical" href="https://www.noizer.one/" />');
		expect(getMetaTag('twitter:card')).toContain('content="summary_large_image"');
		expect(getMetaTag('twitter:title')).toContain(
			'content="Noizer One - The ultimate soundscape app"'
		);
		expect(getMetaTag('twitter:description')).toContain(
			'content="Introducing Noizer One, the ultimate soundscape app for relaxation, concentration, and more. With a vast library of nature, city, and other sounds, you can easily create custom ambient sound environments to fit your needs."'
		);
		expect(getMetaTag('twitter:image')).toContain(
			'content="https://www.noizer.one/img/logo-2.png"'
		);
	});

	test('does not place scripts after the body element', () => {
		const bodyCloseIndex = appHtml.indexOf('</body>');
		const htmlCloseIndex = appHtml.indexOf('</html>');

		expect(bodyCloseIndex).toBeGreaterThan(-1);
		expect(htmlCloseIndex).toBeGreaterThan(bodyCloseIndex);
		expect(appHtml.slice(bodyCloseIndex + '</body>'.length, htmlCloseIndex).trim()).toBe('');
	});

	test('does not use invalid preload attributes on stylesheet links', () => {
		expect(appHtml).not.toMatch(/<link\s+preload\b/);
	});
});
