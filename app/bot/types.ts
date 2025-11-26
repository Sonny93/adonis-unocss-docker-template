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
	| { type: 'follow'; playerName: string }
	| { type: 'stopFollow' };

export type WorkerOutgoingMessage =
	| { type: 'spawned' }
	| { type: 'death' }
	| { type: 'kicked'; reason: string }
	| { type: 'error'; message: string }
	| { type: 'chat'; username: string; message: string }
	| { type: 'health'; health: number; food: number }
	| { type: 'position'; x: number; y: number; z: number }
	| { type: 'stopped' };

export interface BotInstanceInfo {
	botId: string;
	username: string;
	host: string;
	port: number;
	status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
}

