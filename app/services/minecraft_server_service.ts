import MinecraftServer from '#models/minecraft_server';
import logger from '@adonisjs/core/services/logger';

interface CreatePayload {
	name: string;
	host: string;
	port: number;
	version: string;
}

interface UpdatePayload {
	name: string;
	host: string;
	port: number;
	version: string;
}

export class MinecraftServerService {
	async create(payload: CreatePayload): Promise<MinecraftServer> {
		const server = await MinecraftServer.create(payload);
		logger.info({ serverId: server.id, name: server.name }, 'Server created');
		return server;
	}

	async update(id: number, payload: UpdatePayload): Promise<MinecraftServer> {
		const server = await MinecraftServer.findOrFail(id);
		await server.merge(payload).save();
		return server;
	}

	async destroy(id: number): Promise<void> {
		const server = await MinecraftServer.findOrFail(id);
		await server.delete();
		logger.info({ serverId: server.id }, 'Server destroyed');
	}

	async getAll(): Promise<MinecraftServer[]> {
		return MinecraftServer.query().orderBy('id', 'asc');
	}

	async find(id: number): Promise<MinecraftServer> {
		return MinecraftServer.findOrFail(id);
	}
}
