import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
	presets: [
		presetWind4({
			dark: 'class', // Active le mode sombre avec la classe 'dark'
		}),
		presetWebFonts({
			provider: 'bunny',
			fonts: {
				sans: 'Poppins',
			},
		}),
	],
	theme: {
		colors: {
			// Couleurs personnalisées si nécessaire
		},
	},
});
