import { botService } from '#services/bot_service';
import {
	createBotValidator,
	updateBotValidator,
} from '#validators/bot_validator';
import type { HttpContext } from '@adonisjs/core/http';

export default class BotsController {
	async create({ request, response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const payload = await request.validateUsing(createBotValidator);

		await botService.create({
			userId: user.id,
			username: payload.username,
			gameVersion: payload.gameVersion,
		});

		return response.redirect().back();
	}

	async update({ request, response, auth, params }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.id);
		const payload = await request.validateUsing(updateBotValidator);

		await botService.update(botId, user.id, payload);
		return response.redirect().back();
	}

	async destroy({ response, auth, params }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.id);

		await botService.destroy(botId, user.id);

		return response.redirect().back();
	}
}
