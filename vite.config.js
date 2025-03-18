import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		open: '/posts',
		port: 7001,
		headers: {
			'X-Content-Type-Options': ' nosniff',
			// 'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'credentialless',
			'X-Frame-Options': 'DENY',
			'Cross-Origin-Resource-Policy': 'same-origin',
			'Referrer-Policy': 'no-referrer',
			'X-XSS-Protection': '0',
			'X-DNS-Prefetch-Control': 'off',
			'Strict-Transport-Security':
				'max-age=63072000; includeSubDomains preload',
			'Content-Security-Policy-Report-Only': `default-src 'none'; connect-src 'self' localhost:3000 *.tiny.cloud; script-src 'self' *.tiny.cloud 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com/css2 *.tiny.cloud; font-src https:; img-src 'self' https: data:; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/__test__/setup.js',
		include: ['src/__test__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		exclude: [
			'src/__test__/**/delete_*.{test,spec}.?(c|m)[jt]s?(x)',
			'src/__test__/E2E',
		],
		coverage: {
			include: ['src/**'],
			exclude: ['src/**/delete_**'],
		},
	},
});
