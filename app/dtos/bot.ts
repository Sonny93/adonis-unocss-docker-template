import { CommonModelDto } from '#dtos/common_model';
import Bot from '#models/bot';

export class BotDto extends CommonModelDto<Bot> {
	declare id: number;
	declare username: string;
	declare createdAt: string | null;
	declare updatedAt: string | null;

	constructor(bot?: Bot) {
		if (!bot) return;
		super(bot);

		this.id = bot.id;
		this.username = bot.username;
		this.createdAt = bot.createdAt?.toISO();
		this.updatedAt = bot.updatedAt?.toISO();
	}

	serialize(): {
		id: number;
		username: string;
		createdAt: string | null;
		updatedAt: string | null;
	} {
		return {
			...super.serialize(),
			id: this.id,
			username: this.username,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
