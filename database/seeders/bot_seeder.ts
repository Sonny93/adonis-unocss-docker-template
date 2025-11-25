import Bot from '#models/bot';
import User from '#models/user';
import logger from '@adonisjs/core/services/logger';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class BotSeeder extends BaseSeeder {
	async run() {
		const user = await User.findOrFail(1);
		await Bot.createMany([{ userId: user.id, username: 'Arcane93_' }]);
		logger.info('Bots created');
	}
}
