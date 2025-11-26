import Bot from '#models/bot';
import MinecraftServer from '#models/minecraft_server';
import type { HttpContext } from '@adonisjs/core/http';
import { botManager } from '../bot/bot_manager.js';

export default class BotInstancesController {
	async start({ auth, params, request, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.botId);
		const serverId = Number(request.input('serverId'));

		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', user.id)
			.firstOrFail();
		if (botManager.isRunning(String(bot.id))) {
			throw new Error('Bot is already running');
		}

		const server = await MinecraftServer.findOrFail(serverId);

		botManager.start({
			botId: String(bot.id),
			username: bot.username,
			host: server.host,
			port: server.port,
			version: server.version,
		});

		return response.redirect().back();
	}

	async stop({ auth, params, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.botId);

		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', user.id)
			.firstOrFail();

		if (!botManager.isRunning(String(bot.id))) {
			throw new Error('Bot is not running');
		}

		botManager.stop(String(bot.id));
		return response.redirect().back();
	}

	async chat({ auth, params, request, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.botId);
		const message = request.input('message');

		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', user.id)
			.first();

		if (!bot) {
			throw new Error('Bot not found');
		}

		if (!botManager.isRunning(String(bot.id))) {
			throw new Error('Bot is not running');
		}

		botManager.chat(String(bot.id), message);
		return response.redirect().back();
	}

	async goto({ auth, params, request, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const botId = Number(params.botId);
		const { x, y, z } = request.only(['x', 'y', 'z']);

		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', user.id)
			.first();

		if (!bot) {
			throw new Error('Bot not found');
		}

		if (!botManager.isRunning(String(bot.id))) {
			throw new Error('Bot is not running');
		}

		botManager.goto(String(bot.id), Number(x), Number(y), Number(z));
		return response.redirect().back();
	}
}
