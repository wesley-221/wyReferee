CREATE TABLE IF NOT EXISTS irc_channels (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	label TEXT,
	is_private BOOLEAN,
	is_public BOOLEAN
);

CREATE TABLE IF NOT EXISTS irc_messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	channel_id INTEGER,
	date TEXT,
	time TEXT,
	author TEXT,
	raw_message TEXT,
	is_divider BOOLEAN,
	FOREIGN KEY(channel_id) REFERENCES irc_channels(id)
);

CREATE TABLE IF NOT EXISTS message_parts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	message_id INTEGER,
	type TEXT,
	content TEXT,
	link_name TEXT,
	mod_acronym_beatmap_id INTEGER,
	mod_acronym_game_mode INTEGER,
	mod_acronym_mappool_id INTEGER,
	mod_acronym_mod_bracket_id INTEGER,
	mod_acronym_mods TEXT,
	FOREIGN KEY(message_id) REFERENCES irc_messages(id)
);
