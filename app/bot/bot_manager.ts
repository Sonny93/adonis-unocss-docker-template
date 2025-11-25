import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import type {
	BotCredentials,
	WorkerIncomingMessage,
	WorkerOutgoingMessage,
} from './types.js';

export type BotEventHandler = (
	botId: string,
	event: WorkerOutgoingMessage
) => void;

interface BotInstance {
	worker: Worker;
	credentials: BotCredentials;
}

export class BotManager {
	private bots: Map<string, BotInstance> = new Map();
	private eventHandler?: BotEventHandler;

	onEvent(handler: BotEventHandler) {
		this.eventHandler = handler;
	}

	createBot(botId: string, credentials: BotCredentials): void {
		if (this.bots.has(botId)) {
			throw new Error(`Bot ${botId} already exists`);
		}

		const workerPath = join(process.cwd(), 'app', 'bot', 'bot.worker.js');

		const worker = new Worker(workerPath);

		worker.on('message', (message: WorkerOutgoingMessage) => {
			this.eventHandler?.(botId, message);
		});

		worker.on('error', (err) => {
			this.eventHandler?.(botId, { type: 'error', message: err.message });
		});

		worker.on('exit', (code) => {
			if (code !== 0) {
				this.eventHandler?.(botId, {
					type: 'error',
					message: `Worker exited with code ${code}`,
				});
			}
			this.bots.delete(botId);
		});

		this.bots.set(botId, { worker, credentials });

		const spawnMessage: WorkerIncomingMessage = {
			type: 'spawn',
			credentials,
		};
		worker.postMessage(spawnMessage);
	}

	sendCommand(
		botId: string,
		action: 'chat' | 'disconnect',
		data?: string
	): void {
		const bot = this.bots.get(botId);
		if (!bot) {
			throw new Error(`Bot ${botId} not found`);
		}

		const message: WorkerIncomingMessage = {
			type: 'command',
			action,
			data,
		};
		bot.worker.postMessage(message);
	}

	destroyBot(botId: string): void {
		const bot = this.bots.get(botId);
		if (bot) {
			bot.worker.terminate();
			this.bots.delete(botId);
		}
	}

	getBotIds(): string[] {
		return Array.from(this.bots.keys());
	}

	destroyAll(): void {
		for (const [botId] of this.bots) {
			this.destroyBot(botId);
		}
	}
}

export const botManager = new BotManager();
