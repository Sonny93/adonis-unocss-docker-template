import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
	async run() {
		await User.create({
			email: 'admin@example.com',
			minecraftUsername: 'Sonny93',
			password: '^bW4zyz3Tidjqe',
		});
	}
}
