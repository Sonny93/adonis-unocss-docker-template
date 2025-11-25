export interface BotCredentials {
	host: string;
	port: number;
	username: string;
	version: string;
	auth?: 'microsoft' | 'mojang' | 'offline';
}

export interface BotSpawnPayload {
	type: 'spawn';
	credentials: BotCredentials;
}

export interface BotCommandPayload {
	type: 'command';
	action: 'chat' | 'disconnect';
	data?: string;
}

export type WorkerIncomingMessage = BotSpawnPayload | BotCommandPayload;

export interface BotEventSpawn {
	type: 'spawn';
	position: { x: number; y: number; z: number };
}

export interface BotEventChat {
	type: 'chat';
	username: string;
	message: string;
}

export interface BotEventHealth {
	type: 'health';
	health: number;
	food: number;
}

export interface BotEventDeath {
	type: 'death';
}

export interface BotEventError {
	type: 'error';
	message: string;
}

export interface BotEventDisconnected {
	type: 'disconnected';
	reason: string;
}

export interface BotEventReady {
	type: 'ready';
}

export type WorkerOutgoingMessage =
	| BotEventSpawn
	| BotEventChat
	| BotEventHealth
	| BotEventDeath
	| BotEventError
	| BotEventDisconnected
	| BotEventReady;
