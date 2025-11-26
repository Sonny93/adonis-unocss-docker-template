import mineflayer from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { parentPort } from 'node:worker_threads';
import type {
	BotConfig,
	WorkerIncomingMessage,
	WorkerOutgoingMessage,
} from './types.js';

const { pathfinder, Movements, goals } = pathfinderPkg;
const { GoalNear } = goals;

let bot: mineflayer.Bot | null = null;
let positionInterval: ReturnType<typeof setInterval> | null = null;

function send(message: WorkerOutgoingMessage) {
	parentPort?.postMessage(message);
}

function startBot(config: BotConfig) {
	bot = mineflayer.createBot({
		host: config.host,
		port: config.port,
		username: config.username,
		version: config.version,
		auth: 'microsoft',
	});

	bot.loadPlugin(pathfinder);

	bot.on('spawn', () => {
		send({ type: 'spawned' });
		positionInterval = setInterval(() => {
			if (bot?.entity) {
				send({
					type: 'position',
					x: bot.entity.position.x,
					y: bot.entity.position.y,
					z: bot.entity.position.z,
				});
			}
		}, 10);
	});

	bot.on('health', () => {
		if (bot) {
			send({ type: 'health', health: bot.health, food: bot.food });
		}
	});

	bot.on('death', () => {
		send({ type: 'death' });
	});

	bot.on('kicked', (reason) => {
		console.log('kicked', JSON.stringify(reason, null, 2));
		send({ type: 'kicked', reason: String(reason) });
		cleanup();
	});

	bot.on('error', (err) => {
		console.log('error', JSON.stringify(err, null, 2));
		send({ type: 'error', message: err.message });
	});

	bot.on('chat', (username, message) => {
		send({ type: 'chat', username, message });
	});

	bot.on('end', () => {
		send({ type: 'stopped' });
		cleanup();
	});
}

function stopBot() {
	if (bot) {
		bot.quit();
		cleanup();
	}
}

function cleanup() {
	if (positionInterval) {
		clearInterval(positionInterval);
		positionInterval = null;
	}
	bot = null;
}

function handleChat(message: string) {
	bot?.chat(message);
}

function handleGoto(x: number, y: number, z: number) {
	if (!bot) return;
	console.log(`[Bot] Goto requested: ${x}, ${y}, ${z}`);
}

function handleMoveToPlayer(x: number, y: number, z: number) {
	if (!bot) return;
	console.log(`[Bot] MoveToPlayer requested: ${x}, ${y}, ${z}`);
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
}

parentPort?.on('message', (message: WorkerIncomingMessage) => {
	switch (message.type) {
		case 'start':
			startBot(message.config);
			break;
		case 'stop':
			stopBot();
			break;
		case 'chat':
			handleChat(message.message);
			break;
		case 'goto':
			handleGoto(message.x, message.y, message.z);
			break;
		case 'moveToPlayer':
			handleMoveToPlayer(message.x, message.y, message.z);
			break;
	}
});
