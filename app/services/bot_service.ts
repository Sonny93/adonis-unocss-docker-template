import Bot from '#models/bot';
import logger from '@adonisjs/core/services/logger';

interface CreateBotPayload {
	userId: number;
	username: string;
	password?: string;
	gameVersion: string;
}

interface UpdateBotPayload {
	username: string;
	gameVersion: string;
}

export class BotService {
	async create(payload: CreateBotPayload): Promise<Bot> {
		const bot = await Bot.create({
			userId: payload.userId,
			username: payload.username,
			password: payload.password ?? null,
			gameVersion: payload.gameVersion,
		});

		logger.info({ botId: bot.id, username: bot.username }, 'Bot created');
		return bot;
	}

	async update(
		botId: number,
		userId: number,
		payload: UpdateBotPayload
	): Promise<Bot> {
		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', userId)
			.firstOrFail();

		await bot.merge(payload).save();
		return bot;
	}

	async destroy(botId: number, userId: number): Promise<void> {
		const bot = await Bot.query()
			.where('id', botId)
			.where('userId', userId)
			.firstOrFail();

		await bot.delete();
		logger.info({ botId: bot.id }, 'Bot destroyed');
	}

	async list(userId: number): Promise<Bot[]> {
		return Bot.query().where('userId', userId);
	}
}

export const botService = new BotService();
