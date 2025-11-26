declare module 'mineflayer-web-inventory' {
	import type { Bot } from 'mineflayer';

	interface Options {
		port?: number;
	}

	export default function inventoryViewer(bot: Bot, options?: Options): void;
}
