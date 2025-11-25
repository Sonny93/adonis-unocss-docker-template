import { parentPort } from 'node:worker_threads';
import mineflayer, { type Bot } from 'mineflayer';
import type {
	WorkerIncomingMessage,
	WorkerOutgoingMessage,
	BotCredentials,
} from './types.js';

let bot: Bot | null = null;

function send(message: WorkerOutgoingMessage) {
	parentPort?.postMessage(message);
}

function createBot(credentials: BotCredentials) {
	bot = mineflayer.createBot({
		host: credentials.host,
		port: credentials.port,
		username: credentials.username,
		version: credentials.version,
		auth: credentials.auth ?? 'offline',
	});

	bot.on('spawn', () => {
		send({
			type: 'spawn',
			position: {
				x: bot!.entity.position.x,
				y: bot!.entity.position.y,
				z: bot!.entity.position.z,
			},
		});
	});

	bot.on('chat', (username, message) => {
		send({ type: 'chat', username, message });
	});

	bot.on('health', () => {
		send({
			type: 'health',
			health: bot!.health,
			food: bot!.food,
		});
	});

	bot.on('death', () => {
		send({ type: 'death' });
	});

	bot.on('error', (err) => {
		send({ type: 'error', message: err.message });
	});

	bot.on('end', (reason) => {
		send({ type: 'disconnected', reason: reason ?? 'unknown' });
		bot = null;
	});

	send({ type: 'ready' });
}

function handleCommand(action: string, data?: string) {
	if (!bot) return;

	switch (action) {
		case 'chat':
			if (data) bot.chat(data);
			break;
		case 'disconnect':
			bot.quit();
			break;
	}
}

parentPort?.on('message', (message: WorkerIncomingMessage) => {
	switch (message.type) {
		case 'spawn':
			createBot(message.credentials);
			break;
		case 'command':
			handleCommand(message.action, message.data);
			break;
	}
});
