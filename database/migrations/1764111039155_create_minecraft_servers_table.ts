import { defaultTableFields } from '#database/default_table_fields';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'minecraft_servers';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.string('name').notNullable();
			table.string('host').notNullable();
			table.integer('port').notNullable();
			table.string('version').notNullable();

			defaultTableFields(table);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
