import { BotDto } from '#dtos/bot';
import { MinecraftServerDto } from '#dtos/minecraft_server';
import User from '#models/user';
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
		const [bots, servers, tokens] = await Promise.all([
			this.botService.getAll(user.id),
			this.minecraftServerService.getAll(),
			User.accessTokens.all(user),
		]);

		return inertia.render('home', {
			bots: BotDto.fromArray(bots),
			servers: MinecraftServerDto.fromArray(servers),
			apiTokens: tokens.map((t) => ({
				id: t.identifier,
				name: t.name,
				lastUsedAt: t.lastUsedAt?.toISOString() ?? null,
				createdAt: t.createdAt?.toISOString() ?? null,
			})),
		});
	}
}
