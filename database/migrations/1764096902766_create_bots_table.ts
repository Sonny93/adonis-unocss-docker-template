import { defaultTableFields } from '#database/default_table_fields';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'bots';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE')
				.notNullable();
			table.string('username').notNullable();
			defaultTableFields(table);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
