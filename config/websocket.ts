import { defineConfig } from 'adonisjs-websocket';

const websocketConfig = defineConfig({
	middleware: [
		// () => import('#middleware/container_bindings_middleware'),
		// () => import('@adonisjs/auth/initialize_auth_middleware'),
	],
	redis: {
		enabled: false,
	},
});

export default websocketConfig;
