import inertia from '@adonisjs/inertia/vite';
import adonisjs from '@adonisjs/vite/client';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		inertia({ ssr: { enabled: true, entrypoint: 'inertia/ssr.tsx' } }),
		react(),
		adonisjs({
			entrypoints: ['inertia/app/app.tsx'],
			reload: ['resources/views/**/*.edge'],
		}),
		UnoCSS(),
	],

	/**
	 * Define aliases for importing modules from
	 * your frontend code
	 */
	resolve: {
		alias: {
			'~/': `${import.meta.dirname}/inertia/`,
		},
	},
});
