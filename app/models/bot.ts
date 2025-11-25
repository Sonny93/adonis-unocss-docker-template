import AppBaseModel from '#models/app_base_model';
import { belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import User from './user.js';

export default class Bot extends AppBaseModel {
	@column()
	declare userId: number;

	@column()
	declare username: string;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;
}
