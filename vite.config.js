import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomBytes } from 'node:crypto';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	html: {
		cspNonce: randomBytes(16).toString('base64'),
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/__test__/setup.js',
		include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		exclude: ['src/**/delete_*.{test,spec}.?(c|m)[jt]s?(x)'],
		coverage: {
			include: ['src/**'],
			exclude: ['src/**/delete_**'],
		},
	},
});
