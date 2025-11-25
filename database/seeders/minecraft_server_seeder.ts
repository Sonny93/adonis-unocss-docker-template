import MinecraftServer from '#models/minecraft_server';
import logger from '@adonisjs/core/services/logger';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class MinecraftServerSeeder extends BaseSeeder {
	async run() {
		logger.info('Seeding Minecraft servers...');
		await MinecraftServer.createMany([
			{
				name: 'Local',
				host: '192.168.200.135',
				port: 25565,
				version: '1.21.8',
			},
		]);
		logger.info('Minecraft servers seeded');
	}
}
