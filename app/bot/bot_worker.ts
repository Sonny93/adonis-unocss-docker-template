import mineflayer from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { parentPort } from 'node:worker_threads';
import { JobExecutor, JobQueue } from './jobs/index.js';
import type { CollectWoodJob, Job } from './jobs/types.js';
import type {
	BotConfig,
	WorkerIncomingMessage,
	WorkerOutgoingMessage,
} from './types.js';

const { pathfinder, Movements, goals } = pathfinderPkg;
const { GoalNear, GoalBlock } = goals;

let bot: mineflayer.Bot | null = null;
let positionInterval: ReturnType<typeof setInterval> | null = null;
let jobQueue: JobQueue | null = null;
let jobExecutor: JobExecutor | null = null;

function send(message: WorkerOutgoingMessage) {
	parentPort?.postMessage(message);
}

function onJobUpdate(job: Job) {
	send({ type: 'job:update', job });
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

	jobQueue = new JobQueue(onJobUpdate);
	jobExecutor = new JobExecutor(bot, { Movements, GoalBlock }, onJobUpdate);

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
		jobQueue?.cancelAll();
		bot.quit();
		cleanup();
	}
}

function cleanup() {
	if (positionInterval) {
		clearInterval(positionInterval);
		positionInterval = null;
	}
	jobQueue = null;
	jobExecutor = null;
	bot = null;
}

function handleChat(message: string) {
	bot?.chat(message);
}

function handleMoveToPlayer(x: number, y: number, z: number) {
	if (!bot) return;
	jobQueue?.cancelAll();
	console.log(`[Bot] MoveToPlayer requested: ${x}, ${y}, ${z}`);
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
}

function handleCollectWood(amount: number) {
	if (!jobQueue || !jobExecutor) return;

	jobQueue.cancelAll();

	const job: CollectWoodJob = {
		id: crypto.randomUUID(),
		type: 'collect_wood',
		status: 'pending',
		priority: 1,
		createdAt: Date.now(),
		params: { amount, collected: 0 },
	};

	jobQueue.add(job);
	jobQueue.process((j, signal) => jobExecutor!.execute(j, signal));
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
		case 'moveToPlayer':
			handleMoveToPlayer(message.x, message.y, message.z);
			break;
		case 'job:collect_wood':
			handleCollectWood(message.amount);
			break;
		case 'job:cancel':
			jobQueue?.cancel();
			break;
		case 'job:cancel_all':
			jobQueue?.cancelAll();
			break;
	}
});
