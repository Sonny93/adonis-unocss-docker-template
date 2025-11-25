import User from '#models/user';
import logger from '@adonisjs/core/services/logger';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class UserSeeder extends BaseSeeder {
	async run() {
		await User.create({
			email: 'admin@example.com',
			minecraftUsername: 'Sonny93',
			password: '^bW4zyz3Tidjqe',
		});
		logger.info('User created');
	}
}
