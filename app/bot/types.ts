export interface BotConfig {
	botId: string;
	username: string;
	host: string;
	port: number;
	version: string;
}

export type WorkerIncomingMessage =
	| { type: 'start'; config: BotConfig }
	| { type: 'stop' }
	| { type: 'chat'; message: string }
	| { type: 'goto'; x: number; y: number; z: number }
	| { type: 'moveToPlayer'; x: number; y: number; z: number }
	| { type: 'follow'; playerName: string }
	| { type: 'stopFollow' }
	| { type: 'job:collect_wood'; amount: number }
	| { type: 'job:cancel' }
	| { type: 'job:cancel_all' };

import type { Job } from './jobs/types.js';

export type WorkerOutgoingMessage =
	| { type: 'spawned' }
	| { type: 'death' }
	| { type: 'kicked'; reason: string }
	| { type: 'error'; message: string }
	| { type: 'chat'; username: string; message: string }
	| { type: 'health'; health: number; food: number }
	| { type: 'position'; x: number; y: number; z: number }
	| { type: 'stopped' }
	| { type: 'job:update'; job: Job };

export interface BotInstanceInfo {
	botId: string;
	username: string;
	host: string;
	port: number;
	status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
}
