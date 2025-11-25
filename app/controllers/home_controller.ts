import { BotDto } from '#dtos/bot';
import { MinecraftServerDto } from '#dtos/minecraft_server';
import { BotService } from '#services/bot_service';
import { MinecraftServerService } from '#services/minecraft_server_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class HomeController {
	constructor(
		private botService: BotService,
		private minecraftServerService: MinecraftServerService
	) {}

	async index({ inertia, auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const [bots, servers] = await Promise.all([
			this.botService.getAll(user.id),
			this.minecraftServerService.getAll(),
		]);

		return inertia.render('home', {
			bots: BotDto.fromArray(bots),
			servers: MinecraftServerDto.fromArray(servers),
		});
	}
}
