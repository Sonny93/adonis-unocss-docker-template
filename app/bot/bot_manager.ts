import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import type {
	BotConfig,
	BotInstanceInfo,
	WorkerIncomingMessage,
	WorkerOutgoingMessage,
} from './types.js';

type EventCallback = (botId: string, event: WorkerOutgoingMessage) => void;

class BotManager {
	private workers = new Map<string, Worker>();
	private instances = new Map<string, BotInstanceInfo>();
	private eventCallbacks: EventCallback[] = [];

	private getWorkerPath(): string {
		const currentFile = fileURLToPath(import.meta.url);
		const currentDir = dirname(currentFile);
		return join(currentDir, 'bot_worker.js');
	}

	start(config: BotConfig): BotInstanceInfo {
		if (this.workers.has(config.botId)) {
			throw new Error(`Bot ${config.botId} is already running`);
		}

		const worker = new Worker(this.getWorkerPath());
		this.workers.set(config.botId, worker);

		const instanceInfo: BotInstanceInfo = {
			botId: config.botId,
			username: config.username,
			host: config.host,
			port: config.port,
			status: 'starting',
		};
		this.instances.set(config.botId, instanceInfo);

		worker.on('message', (message: WorkerOutgoingMessage) => {
			this.handleWorkerMessage(config.botId, message);
		});

		worker.on('error', (err) => {
			this.updateStatus(config.botId, 'error');
			this.emit(config.botId, { type: 'error', message: err.message });
		});

		worker.on('exit', () => {
			this.workers.delete(config.botId);
			this.updateStatus(config.botId, 'stopped');
		});

		this.sendToWorker(config.botId, { type: 'start', config });

		return instanceInfo;
	}

	stop(botId: string): void {
		const worker = this.workers.get(botId);
		if (!worker) {
			throw new Error(`Bot ${botId} is not running`);
		}

		this.updateStatus(botId, 'stopping');
		this.sendToWorker(botId, { type: 'stop' });
		this.deleteInstance(botId);
	}

	chat(botId: string, message: string): void {
		this.sendToWorker(botId, { type: 'chat', message });
	}

	moveToPlayer(botId: string, x: number, y: number, z: number): void {
		this.sendToWorker(botId, { type: 'moveToPlayer', x, y, z });
	}

	collectWood(botId: string, amount: number): void {
		this.sendToWorker(botId, { type: 'job:collect_wood', amount });
	}

	cancelJob(botId: string): void {
		this.sendToWorker(botId, { type: 'job:cancel' });
	}

	cancelAllJobs(botId: string): void {
		this.sendToWorker(botId, { type: 'job:cancel_all' });
	}

	deleteInstance(botId: string): void {
		this.workers.delete(botId);
		this.instances.delete(botId);
	}

	getInstances(): BotInstanceInfo[] {
		return Array.from(this.instances.values());
	}

	getInstance(botId: string): BotInstanceInfo | undefined {
		return this.instances.get(botId);
	}

	isRunning(botId: string): boolean {
		return this.workers.has(botId);
	}

	onEvent(callback: EventCallback): void {
		this.eventCallbacks.push(callback);
	}

	private sendToWorker(botId: string, message: WorkerIncomingMessage): void {
		const worker = this.workers.get(botId);
		if (worker) {
			worker.postMessage(message);
		} else {
			console.log("le worker n'existe pas");
		}
	}

	private handleWorkerMessage(
		botId: string,
		message: WorkerOutgoingMessage
	): void {
		switch (message.type) {
			case 'spawned':
				this.updateStatus(botId, 'running');
				break;
			case 'stopped':
			case 'kicked':
				this.updateStatus(botId, 'stopped');
				this.deleteInstance(botId);
				break;
			case 'error':
				this.updateStatus(botId, 'error');
				this.deleteInstance(botId);
				break;
		}

		this.emit(botId, message);
	}

	private updateStatus(botId: string, status: BotInstanceInfo['status']): void {
		const instance = this.instances.get(botId);
		if (instance) {
			instance.status = status;
		}
	}

	private emit(botId: string, event: WorkerOutgoingMessage): void {
		for (const callback of this.eventCallbacks) {
			callback(botId, event);
		}
	}
}

export const botManager = new BotManager();
