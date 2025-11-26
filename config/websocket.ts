import { defineConfig } from 'adonisjs-websocket';

const websocketConfig = defineConfig({
	middleware: [
		() => import('#middleware/container_bindings_middleware'),
		() => import('@adonisjs/session/session_middleware'),
		() => import('@adonisjs/auth/initialize_auth_middleware'),
		() => import('#middleware/ws_auth_middleware'),
	],
	redis: {
		enabled: false,
	},
});

export default websocketConfig;
