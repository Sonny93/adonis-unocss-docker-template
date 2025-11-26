import { BotDto } from '#dtos/bot';
import { MinecraftServerDto } from '#dtos/minecraft_server';
import Bot from '#models/bot';
import { MinecraftServerService } from '#services/minecraft_server_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { botManager } from '../bot/bot_manager.js';

@inject()
export default class BotControlController {
	constructor(private minecraftServerService: MinecraftServerService) {}

	async show({ inertia, auth, params, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.id);

		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', user.id)
			.first();

		if (!bot) {
			return response.notFound();
		}

		const servers = await this.minecraftServerService.getAll();
		const instance = botManager.getInstance(String(bot.id)) ?? null;

		return inertia.render('bot/control', {
			bot: new BotDto(bot).serialize(),
			servers: MinecraftServerDto.fromArray(servers),
			instance,
		});
	}
}
