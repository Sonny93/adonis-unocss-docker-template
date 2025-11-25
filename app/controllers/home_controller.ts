import type { HttpContext } from '@adonisjs/core/http';
import Bot from '#models/bot';

export default class HomeController {
	async index({ inertia, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const bots = await Bot.query().where('userId', user.id);

		return inertia.render('home', {
			user: {
				id: user.id,
				minecraftUsername: user.minecraftUsername,
				email: user.email,
			},
			bots: bots.map((bot) => ({
				id: bot.id,
				username: bot.username,
				gameVersion: bot.gameVersion,
				createdAt: bot.createdAt.toISO(),
			})),
		});
	}
}
