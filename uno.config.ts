import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetWind4, transformerDirectives } from 'unocss';

export default defineConfig({
	presets: [
		presetWind4({
			dark: 'class',
		}),
		presetWebFonts({
			provider: 'bunny',
			fonts: {
				sans: 'Poppins',
			},
		}),
	],
	transformers: [transformerDirectives()],
	theme: {
		colors: {},
	},
});
