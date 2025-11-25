import AppBaseModel from '#models/app_base_model';
import { column } from '@adonisjs/lucid/orm';

export default class MinecraftServer extends AppBaseModel {
	@column()
	declare name: string;

	@column()
	declare host: string;

	@column()
	declare port: number;

	@column()
	declare version: string;
}
