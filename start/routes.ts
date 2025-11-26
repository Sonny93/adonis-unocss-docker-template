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
const ApiTokensController = () => import('#controllers/api_tokens_controller');

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

		router.get('/api-tokens', [ApiTokensController, 'index']);
		router.post('/api-tokens', [ApiTokensController, 'store']);
		router.delete('/api-tokens/:id', [ApiTokensController, 'destroy']);
	})
	.use(middleware.auth());

import type { WsClientType } from '#middleware/ws_auth_middleware';
import logger from '@adonisjs/core/services/logger';

interface WsClient {
	send: (data: string) => void;
	type: WsClientType;
	userId: number;
}

type WsIncomingMessage = {
	type: 'moveToPlayer';
	botId: string;
	data: { x: number; y: number; z: number };
};

const wsClients = new Map<string, WsClient>();

botManager.onEvent((botId: string, event: WorkerOutgoingMessage) => {
	const payload = JSON.stringify({ botId, event });
	for (const client of Array.from(wsClients.values())) {
		client.send(payload);
	}
});

router.ws('/ws', ({ ws, auth, wsClientType }) => {
	const user = auth.user!;
	wsClients.set(ws.id, {
		send: (data) => ws.send(data),
		type: wsClientType!,
		userId: user.id,
	});

	ws.on('message', (rawMessage) => {
		logger.debug(`[${wsClientType}] ${rawMessage.toString()}`);

		try {
			const message: WsIncomingMessage = JSON.parse(rawMessage.toString());

			if (message.type === 'moveToPlayer') {
				const { botId = '1', data } = message;
				console.log('route moveToPlayer', botId, message);
				if (botManager.isRunning(botId)) {
					console.log('botManager.moveToPlayer');
					botManager.moveToPlayer(botId, data.x, data.y, data.z);
				} else {
					console.log('bot is not running');
				}
			}
		} catch {
			logger.warn(`Invalid WebSocket message: ${rawMessage.toString()}`);
		}
	});

	ws.on('close', () => {
		wsClients.delete(ws.id);
	});
});
