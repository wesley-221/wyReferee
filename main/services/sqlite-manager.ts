export class SqliteManager {
	// private database: Database;

	// constructor() {
	// 	const dbPath = path.join(app.getPath('userData'), 'data', 'irc.db');

	// 	this.database = require('better-sqlite3')(dbPath);
	// 	this.database.pragma('journal_mode = WAL');
	// }

	// /**
	//  * Creates a new IRC channel in the database
	//  *
	//  * @param ircChannel the IRC channel to create
	//  */
	// createIrcChannel(ircChannel: IrcChannel | any): number | bigint {
	// 	const ircChannelQuery = this.database.prepare(
	// 		`INSERT INTO IrcChannel (name, label, active, lastActiveChannel, isPrivateChannel, isPublicChannel, hasUnreadMessages, playSoundOnMessage, teamMode, winCondition, players, editingLabel, oldLabel)
	// 		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	// 	);

	// 	const info = ircChannelQuery.run(
	// 		ircChannel.name,
	// 		ircChannel.label,
	// 		ircChannel.active ? 1 : 0,
	// 		ircChannel.lastActiveChannel ? 1 : 0,
	// 		ircChannel.isPrivateChannel ? 1 : 0,
	// 		ircChannel.isPublicChannel ? 1 : 0,
	// 		ircChannel.hasUnreadMessages ? 1 : 0,
	// 		ircChannel.playSoundOnMessage ? 1 : 0,
	// 		ircChannel.teamMode,
	// 		ircChannel.winCondition,
	// 		ircChannel.players,
	// 		ircChannel.editingLabel ? 1 : 0,
	// 		ircChannel.oldLabel
	// 	);

	// 	return info.lastInsertRowid;
	// }

	// /**
	//  * Inserts an irc message into the database
	//  *
	//  * @param message the message to insert
	//  * @param ircChannelId the id of the irc channel to add the message to
	//  * @param target 'messages' for regular messages or 'bancho' for Bancho messages.
	//  */
	// insertIrcMessage(message: IrcMessage, ircChannelId: number, target: 'messages' | 'bancho'): number {
	// 	const insertMessage = this.database.prepare(
	// 		`INSERT INTO IrcMessage (messageId, date, time, author, isADivider) VALUES (?, ?, ?, ?, ?)`
	// 	);

	// 	const insertBuilder = this.database.prepare(
	// 		`INSERT INTO MessageBuilder (messageType, message, linkName, modAcronymBeatmapId, modAcronymGameMode, modAcronymMappoolId, modAcronymModBracketId, ircMessageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	// 	);

	// 	const insertWyMod = this.database.prepare(
	// 		`INSERT INTO WyMod (name, value) VALUES (?, ?)`
	// 	);

	// 	const insertBuilderMod = this.database.prepare(
	// 		`INSERT INTO MessageBuilder_WyMod (messageBuilderId, wyModId) VALUES (?, ?)`
	// 	);

	// 	const insertChannelMessage = this.database.prepare(
	// 		`INSERT INTO IrcChannel_Messages (ircChannelId, ircMessageId) VALUES (?, ?)`
	// 	);

	// 	const insertBanchoMessage = this.database.prepare(
	// 		`INSERT INTO IrcChannel_BanchoMessages (ircChannelId, ircMessageId) VALUES (?, ?)`
	// 	);

	// 	const transaction = this.database.transaction((msg: IrcMessage) => {
	// 		const result = insertMessage.run(
	// 			msg.messageId,
	// 			msg.date,
	// 			msg.time,
	// 			msg.author,
	// 			msg.isADivider ? 1 : 0
	// 		);

	// 		const ircMessageId = result.lastInsertRowid as number;

	// 		for (const builder of msg.messageBuilder) {
	// 			const builderResult = insertBuilder.run(
	// 				builder.messageType,
	// 				builder.message,
	// 				builder.linkName || null,
	// 				builder.modAcronymBeatmapId ?? null,
	// 				builder.modAcronymGameMode ?? null,
	// 				builder.modAcronymMappoolId ?? null,
	// 				builder.modAcronymModBracketId ?? null,
	// 				ircMessageId
	// 			);

	// 			const messageBuilderId = builderResult.lastInsertRowid as number;

	// 			if (builder.modAcronymMods?.length) {
	// 				for (const mod of builder.modAcronymMods) {
	// 					const wyModResult = insertWyMod.run(
	// 						mod.name,
	// 						mod.value.toString()
	// 					);

	// 					const wyModId = wyModResult.lastInsertRowid as number;

	// 					insertBuilderMod.run(messageBuilderId, wyModId);
	// 				}
	// 			}
	// 		}

	// 		if (target === 'messages') {
	// 			insertChannelMessage.run(ircChannelId, ircMessageId);
	// 		}
	// 		else if (target === 'bancho') {
	// 			insertBanchoMessage.run(ircChannelId, ircMessageId);
	// 		}

	// 		return ircMessageId;
	// 	});

	// 	return transaction(message);
	// }

	// /**
	//  * Gets an IRC channel by the id
	//  *
	//  * @param ircChannelId the id of the IRC channel to retrieve
	//  */
	// getIrcChannel(ircChannelId: number): IrcChannel | null {
	// 	const selectChannel = this.database.prepare('SELECT * FROM IrcChannel WHERE id = ?');
	// 	const selectMessageIds = this.database.prepare('SELECT ircMessageId FROM IrcChannel_Messages WHERE ircChannelId = ?');
	// 	const selectBanchoMessageIds = this.database.prepare('SELECT ircMessageId FROM IrcChannel_BanchoMessages WHERE ircChannelId = ?');
	// 	const selectPlainMessages = this.database.prepare('SELECT value FROM IrcChannel_PlainMessageHistory WHERE ircChannelId = ?');
	// 	const selectMessage = this.database.prepare('SELECT * FROM IrcMessage WHERE id = ?');
	// 	const selectBuilders = this.database.prepare('SELECT * FROM MessageBuilder WHERE ircMessageId = ?');
	// 	const selectMods = this.database.prepare('SELECT wm.* FROM WyMod wm JOIN MessageBuilder_WyMod mbwm ON wm.id = mbwm.wyModId WHERE mbwm.messageBuilderId = ?');

	// 	const channelRow: any = selectChannel.get(ircChannelId);

	// 	if (!channelRow) return null;

	// 	const loadMessagesByIds = (ids: number[]) => {
	// 		const results = ids.map(id => {
	// 			const msgRow: any = selectMessage.get(id);
	// 			if (!msgRow) return null;

	// 			const builders = selectBuilders.all(msgRow.id).map((builder: any) => {
	// 				const mods = selectMods.all(builder.id).map((mod: any) => {
	// 					const newMod = new WyMod();

	// 					newMod.id = mod.id;
	// 					newMod.name = mod.name;
	// 					newMod.value = mod.value;

	// 					return newMod;
	// 				});

	// 				const newBuilder = new MessageBuilder();

	// 				newBuilder.messageType = builder.messageType;
	// 				newBuilder.message = builder.message;
	// 				newBuilder.linkName = builder.linkName || '';
	// 				newBuilder.modAcronymBeatmapId = builder.modAcronymBeatmapId;
	// 				newBuilder.modAcronymGameMode = builder.modAcronymGameMode;
	// 				newBuilder.modAcronymMappoolId = builder.modAcronymMappoolId;
	// 				newBuilder.modAcronymModBracketId = builder.modAcronymModBracketId;
	// 				newBuilder.modAcronymMods = mods;

	// 				return newBuilder;
	// 			});

	// 			const newMessage = new IrcMessage();

	// 			newMessage.messageId = msgRow.id;
	// 			newMessage.date = msgRow.date;
	// 			newMessage.time = msgRow.time;
	// 			newMessage.author = msgRow.author;
	// 			newMessage.isADivider = !!msgRow.isADivider;
	// 			newMessage.messageBuilder = builders;

	// 			return newMessage;
	// 		});

	// 		return results.filter((m) => m !== null);
	// 	};

	// 	const messages = loadMessagesByIds(
	// 		selectMessageIds.all(ircChannelId).map((row: any) => row.ircMessageId)
	// 	);

	// 	const banchoMessages = loadMessagesByIds(
	// 		selectBanchoMessageIds.all(ircChannelId).map((row: any) => row.ircMessageId)
	// 	);

	// 	const plainMessages = selectPlainMessages.all(ircChannelId).map((row: any) => row.value);

	// 	const ircChannel: IrcChannel = {
	// 		name: channelRow.name,
	// 		label: channelRow.label,
	// 		active: !!channelRow.active,
	// 		lastActiveChannel: !!channelRow.lastActiveChannel,
	// 		isPrivateChannel: !!channelRow.isPrivateChannel,
	// 		isPublicChannel: !!channelRow.isPublicChannel,
	// 		hasUnreadMessages: !!channelRow.hasUnreadMessages,
	// 		playSoundOnMessage: !!channelRow.playSoundOnMessage,
	// 		teamMode: channelRow.teamMode,
	// 		winCondition: channelRow.winCondition,
	// 		players: channelRow.players,
	// 		editingLabel: !!channelRow.editingLabel,
	// 		oldLabel: channelRow.oldLabel,
	// 		messages,
	// 		banchoBotMessages: banchoMessages,
	// 		plainMessageHistory: plainMessages
	// 	};

	// 	return ircChannel;
	// }

	// /**
	//  * Creates the SQLite database and initializes it with the schema.
	//  */
	// createDatabase() {
	// 	const schemaPath = path.join(__dirname, '../../../main/utils/sqlite-schema.sql');
	// 	const schema = fs.readFileSync(schemaPath, 'utf-8');

	// 	this.database.exec(schema);
	// }
}
