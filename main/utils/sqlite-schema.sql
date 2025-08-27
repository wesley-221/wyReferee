-- Main IrcChannel table
CREATE TABLE IF NOT EXISTS IrcChannel (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	label TEXT NOT NULL,
	active INTEGER,
	lastActiveChannel INTEGER,
	isPrivateChannel INTEGER,
	isPublicChannel INTEGER,
	hasUnreadMessages INTEGER,
	playSoundOnMessage INTEGER,
	teamMode INTEGER,          -- enum: TeamMode
	winCondition INTEGER,      -- enum: WinCondition
	players INTEGER,
	editingLabel INTEGER,
	oldLabel TEXT
);

-- IrcMessage table
CREATE TABLE IF NOT EXISTS IrcMessage (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	messageId INTEGER NOT NULL,
	date TEXT NOT NULL,
	time TEXT NOT NULL,
	author TEXT NOT NULL,
	isADivider INTEGER NOT NULL
);

-- MessageBuilder table
CREATE TABLE IF NOT EXISTS MessageBuilder (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	messageType TEXT NOT NULL,                 -- enum: MessageType
	message TEXT NOT NULL,
	linkName TEXT,
	modAcronymBeatmapId INTEGER,
	modAcronymGameMode INTEGER,
	modAcronymMappoolId INTEGER,
	modAcronymModBracketId INTEGER,
	ircMessageId INTEGER,                      -- optional FK to IrcMessage
	FOREIGN KEY (ircMessageId) REFERENCES IrcMessage(id)
);

-- WyMod table
CREATE TABLE IF NOT EXISTS WyMod (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	value TEXT NOT NULL
);

-- Join table: MessageBuilder <-> WyMod (many-to-many)
CREATE TABLE IF NOT EXISTS MessageBuilder_WyMod (
	messageBuilderId INTEGER NOT NULL,
	wyModId INTEGER NOT NULL,
	PRIMARY KEY (messageBuilderId, wyModId),
	FOREIGN KEY (messageBuilderId) REFERENCES MessageBuilder(id),
	FOREIGN KEY (wyModId) REFERENCES WyMod(id)
);

-- Join table: IrcChannel.messages
CREATE TABLE IF NOT EXISTS IrcChannel_Messages (
	ircChannelId INTEGER NOT NULL,
	ircMessageId INTEGER NOT NULL,
	PRIMARY KEY (ircChannelId, ircMessageId),
	FOREIGN KEY (ircChannelId) REFERENCES IrcChannel(id),
	FOREIGN KEY (ircMessageId) REFERENCES IrcMessage(id)
);

-- Join table: IrcChannel.banchoBotMessages
CREATE TABLE IF NOT EXISTS IrcChannel_BanchoMessages (
	ircChannelId INTEGER NOT NULL,
	ircMessageId INTEGER NOT NULL,
	PRIMARY KEY (ircChannelId, ircMessageId),
	FOREIGN KEY (ircChannelId) REFERENCES IrcChannel(id),
	FOREIGN KEY (ircMessageId) REFERENCES IrcMessage(id)
);

-- IrcChannel.plainMessageHistory (as separate table for strings)
CREATE TABLE IF NOT EXISTS IrcChannel_PlainMessageHistory (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ircChannelId INTEGER NOT NULL,
	value TEXT NOT NULL,
	FOREIGN KEY (ircChannelId) REFERENCES IrcChannel(id)
);
