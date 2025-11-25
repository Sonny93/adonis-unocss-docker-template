import logger from '@adonisjs/core/services/logger';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class IndexSeeder extends BaseSeeder {
	private async seed(Seeder: { default: typeof BaseSeeder }) {
		await new Seeder.default(this.client).run();
	}

	async run() {
		logger.info('Seeding users...');
		await this.seed(await import('#database/seeders/user_seeder'));
		logger.info('Seeding bots...');
		await this.seed(await import('#database/seeders/bot_seeder'));
		logger.info('Seeding Minecraft servers...');
		await this.seed(await import('#database/seeders/minecraft_server_seeder'));
		logger.info('Seeding completed');
	}
}
