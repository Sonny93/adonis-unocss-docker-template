import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
import { botManager } from '../app/bot/bot_manager.js';
import type { WorkerOutgoingMessage } from '../app/bot/types.js';

const AuthController = () => import('#controllers/auth_controller');
const HomeController = () => import('#controllers/home_controller');
const BotsController = () => import('#controllers/bots_controller');
const BotControlController = () =>
	import('#controllers/bot_control_controller');
const BotInstancesController = () =>
	import('#controllers/bot_instances_controller');
const MinecraftServersController = () =>
	import('#controllers/minecraft_servers_controller');

router
	.group(() => {
		router.get('/login', [AuthController, 'showLogin']);
		router.post('/login', [AuthController, 'login']);
		router.get('/register', [AuthController, 'showRegister']);
		router.post('/register', [AuthController, 'register']);
	})
	.use(middleware.guest());

router
	.group(() => {
		router.get('/', [HomeController, 'index']).as('home');
		router.get('/logout', [AuthController, 'logout']);

		router.post('/bots', [BotsController, 'create']);
		router.put('/bots/:id', [BotsController, 'update']);
		router.delete('/bots/:id', [BotsController, 'destroy']);
		router
			.get('/bots/:id/control', [BotControlController, 'show'])
			.as('bot.control');

		router.post('/bot-instances/:botId/start', [
			BotInstancesController,
			'start',
		]);
		router.post('/bot-instances/:botId/stop', [BotInstancesController, 'stop']);
		router.post('/bot-instances/:botId/chat', [BotInstancesController, 'chat']);
		router.post('/bot-instances/:botId/goto', [BotInstancesController, 'goto']);

		router.post('/servers', [MinecraftServersController, 'create']);
		router.put('/servers/:id', [MinecraftServersController, 'update']);
		router.delete('/servers/:id', [MinecraftServersController, 'destroy']);
	})
	.use(middleware.auth());

const wsClients = new Map<string, { send: (data: string) => void }>();

botManager.onEvent((botId: string, event: WorkerOutgoingMessage) => {
	const payload = JSON.stringify({ botId, event });
	for (const client of Array.from(wsClients.values())) {
		client.send(payload);
	}
});

router.ws('/ws', ({ ws }) => {
	wsClients.set(ws.id, ws);

	ws.on('close', () => {
		wsClients.delete(ws.id);
	});
});
