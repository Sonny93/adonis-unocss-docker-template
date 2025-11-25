import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'bots';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE')
				.notNullable();
			table.string('username').notNullable();
			table.string('password').nullable();
			table.string('game_version').notNullable();
			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
