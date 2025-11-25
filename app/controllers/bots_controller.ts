import { BotService } from '#services/bot_service';
import {
	createBotValidator,
	updateBotValidator,
} from '#validators/bot_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class BotsController {
	constructor(private botService: BotService) {}

	async create({ request, response, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const payload = await request.validateUsing(createBotValidator);

		await this.botService.create({
			userId: user.id,
			username: payload.username,
		});

		return response.redirect().back();
	}

	async update({ request, response, auth, params }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.id);
		const payload = await request.validateUsing(updateBotValidator);

		await this.botService.update(botId, user.id, payload);
		return response.redirect().back();
	}

	async destroy({ response, auth, params }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.id);
		await this.botService.destroy(botId, user.id);
		return response.redirect().back();
	}
}
