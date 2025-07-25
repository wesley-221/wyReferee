import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export class SqliteHandler {
	private database: DatabaseType;

	constructor() {
		const dbPath = path.join(app.getPath('userData'), 'data', 'irc.db');

		this.database = new Database(dbPath);
		this.database.pragma('journal_mode = WAL');
	}

	/**
	 * Creates the SQLite database and initializes it with the schema.
	 */
	createDatabase() {
		const schemaPath = path.join(__dirname, '../../../main/utils/sqlite-schema.sql');
		const schema = fs.readFileSync(schemaPath, 'utf-8');

		this.database.exec(schema);
	}
}
