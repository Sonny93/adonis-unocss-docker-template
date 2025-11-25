import { MinecraftServerService } from '#services/minecraft_server_service';
import {
	createServerValidator,
	updateServerValidator,
} from '#validators/minecraft_server_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class MinecraftServersController {
	constructor(private minecraftServerService: MinecraftServerService) {}

	async create({ request, response }: HttpContext) {
		const payload = await request.validateUsing(createServerValidator);
		await this.minecraftServerService.create(payload);
		return response.redirect().back();
	}

	async update({ request, response, params }: HttpContext) {
		const id = Number(params.id);
		const payload = await request.validateUsing(updateServerValidator);
		await this.minecraftServerService.update(id, payload);
		return response.redirect().back();
	}

	async destroy({ response, params }: HttpContext) {
		const id = Number(params.id);
		await this.minecraftServerService.destroy(id);
		return response.redirect().back();
	}
}
