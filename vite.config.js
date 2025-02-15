import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomBytes } from 'node:crypto';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	html: {
		cspNonce: randomBytes(16).toString('base64'),
	},
});
