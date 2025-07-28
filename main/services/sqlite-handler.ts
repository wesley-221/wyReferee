import { Database } from 'better-sqlite3';
import { IrcChannel } from '../types/irc-channel';
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { IrcMessage } from '../types/irc-message';


export class SqliteHandler {
	private database: Database;

	constructor() {
		const dbPath = path.join(app.getPath('userData'), 'data', 'irc.db');

		this.database = require('better-sqlite3')(dbPath);
		this.database.pragma('journal_mode = WAL');
	}

	/**
	 * Creates a new IRC channel in the database
	 *
	 * @param ircChannel the IRC channel to create
	 */
	createIrcChannel(ircChannel: IrcChannel | any): number | bigint {
		const ircChannelQuery = this.database.prepare(
			`INSERT INTO IrcChannel (name, label, active, lastActiveChannel, isPrivateChannel, isPublicChannel, hasUnreadMessages, playSoundOnMessage, teamMode, winCondition, players, editingLabel, oldLabel)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		);

		const info = ircChannelQuery.run(
			ircChannel.name,
			ircChannel.label,
			ircChannel.active ? 1 : 0,
			ircChannel.lastActiveChannel ? 1 : 0,
			ircChannel.isPrivateChannel ? 1 : 0,
			ircChannel.isPublicChannel ? 1 : 0,
			ircChannel.hasUnreadMessages ? 1 : 0,
			ircChannel.playSoundOnMessage ? 1 : 0,
			ircChannel.teamMode,
			ircChannel.winCondition,
			ircChannel.players,
			ircChannel.editingLabel ? 1 : 0,
			ircChannel.oldLabel
		);

		return info.lastInsertRowid;
	}

	/**
	 * Inserts an irc message into the database
	 *
	 * @param message the message to insert
	 * @param ircChannelId the id of the irc channel to add the message to
	 * @param target 'messages' for regular messages or 'bancho' for Bancho messages.
	 */
	insertIrcMessage(message: IrcMessage, ircChannelId: number, target: 'messages' | 'bancho'): number {
		const insertMessage = this.database.prepare(
			`INSERT INTO IrcMessage (messageId, date, time, author, isADivider) VALUES (?, ?, ?, ?, ?)`
		);

		const insertBuilder = this.database.prepare(
			`INSERT INTO MessageBuilder (messageType, message, linkName, modAcronymBeatmapId, modAcronymGameMode, modAcronymMappoolId, modAcronymModBracketId, ircMessageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
		);

		const insertWyMod = this.database.prepare(
			`INSERT INTO WyMod (name, value) VALUES (?, ?)`
		);

		const insertBuilderMod = this.database.prepare(
			`INSERT INTO MessageBuilder_WyMod (messageBuilderId, wyModId) VALUES (?, ?)`
		);

		const insertChannelMessage = this.database.prepare(
			`INSERT INTO IrcChannel_Messages (ircChannelId, ircMessageId) VALUES (?, ?)`
		);

		const insertBanchoMessage = this.database.prepare(
			`INSERT INTO IrcChannel_BanchoMessages (ircChannelId, ircMessageId) VALUES (?, ?)`
		);

		const transaction = this.database.transaction((msg: IrcMessage) => {
			const result = insertMessage.run(
				msg.messageId,
				msg.date,
				msg.time,
				msg.author,
				msg.isADivider ? 1 : 0
			);

			const ircMessageId = result.lastInsertRowid as number;

			for (const builder of msg.messageBuilder) {
				const builderResult = insertBuilder.run(
					builder.messageType,
					builder.message,
					builder.linkName || null,
					builder.modAcronymBeatmapId ?? null,
					builder.modAcronymGameMode ?? null,
					builder.modAcronymMappoolId ?? null,
					builder.modAcronymModBracketId ?? null,
					ircMessageId
				);

				const messageBuilderId = builderResult.lastInsertRowid as number;

				if (builder.modAcronymMods?.length) {
					for (const mod of builder.modAcronymMods) {
						const wyModResult = insertWyMod.run(
							mod.name,
							mod.value.toString()
						);

						const wyModId = wyModResult.lastInsertRowid as number;

						insertBuilderMod.run(messageBuilderId, wyModId);
					}
				}
			}

			if (target === 'messages') {
				insertChannelMessage.run(ircChannelId, ircMessageId);
			}
			else if (target === 'bancho') {
				insertBanchoMessage.run(ircChannelId, ircMessageId);
			}

			return ircMessageId;
		});

		return transaction(message);
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
