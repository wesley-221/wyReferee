import { app, ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";
import { WindowManager } from "../services/window-manager";

import * as fs from "fs";
import * as path from "path";

const streams: Record<string, fs.WriteStream> = {};
const channelsDir = path.join(app.getPath('userData'), 'data', 'irc');

if (!fs.existsSync(channelsDir)) {
	fs.mkdirSync(channelsDir, { recursive: true });
}

/**
 * Sanitize a string to be used as a file name
 *
 * @param name the string to sanitize
 */
function sanitizeString(name: string): string {
	return name.replace(/[^a-zA-Z0-9-_#]/g, '_').toLowerCase();
}

/**
 * Get the file name for the irc channel
 *
 * @param channelName the name of the irc channel to get
 */
function getChannelFileName(channelName: string): string {
	const safeName = sanitizeString(channelName);
	return path.join(channelsDir, `${safeName}.json`);
}

/**
 * Get the messages file name for the irc channel
 *
 * @param channelName the name of the irc channel to get
 */
function getChannelMessagesFileName(channelName: string): string {
	const safeName = sanitizeString(channelName);
	return path.join(channelsDir, `${safeName}.messages.ndjson`);
}

/**
 * Get the irc channel object from file
 *
 * @param channelName the name of the irc channel to get
 */
function getIrcChannel(channelName: string) {
	const filePath = getChannelFileName(channelName);

	if (fs.existsSync(filePath)) {
		let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		return data;
	}

	return null;
}

/**
 * Initialize message streams for an irc channel
 *
 * @param channelName the name of the irc channel
 */
function initMessageStreams(channelName: string) {
	// Skip if already initialized
	if (streams[channelName]) {
		return;
	}

	const messagesFilePath = getChannelMessagesFileName(channelName);
	streams[channelName] = fs.createWriteStream(messagesFilePath, { flags: 'a' });
}

/**
 * Load irc channel messages from file
 *
 * @param channelName the name of the irc channel
 */
function loadIrcChannelMessages(channelName: string) {
	const messagesFilePath = getChannelMessagesFileName(channelName);

	if (!fs.existsSync(messagesFilePath)) {
		return [];
	}

	const lines = fs.readFileSync(messagesFilePath, 'utf-8')
		.split('\n')
		.filter(line => line.trim() !== '');

	return lines.map(line => JSON.parse(line));
}

/**
 * Initializes and gets the irc channel object
 *
 * @param channelName the name of the irc channel
 */
function initializeAndGetIrcChannel(channelName: string) {
	const ircChannel = getIrcChannel(channelName);

	if (ircChannel == null) {
		return;
	}

	const channelMessages = loadIrcChannelMessages(channelName);

	for (const message of channelMessages) {
		if (message.type === 'message') {
			ircChannel.messages.push(message.content);
		}
		else if (message.type === 'plain') {
			ircChannel.plainMessageHistory.push(message.content);
		}
	}

	initMessageStreams(channelName);

	return ircChannel;
}

/**
 * Write a message to the irc channel's message stream
 *
 * @param channelName the irc channel to write the message to
 * @param message the message object that was sent
 * @param plainMessage the plain message
 */
function writeMessageToIrcChannel(channelName: string, message: any, plainMessage: any) {
	const sanitizedChannelName = sanitizeString(channelName);

	if (!streams[sanitizedChannelName]) {
		return;
	}

	streams[sanitizedChannelName].write(JSON.stringify({ type: 'message', content: message }) + '\n');
	streams[sanitizedChannelName].write(JSON.stringify({ type: 'plain', content: plainMessage }) + '\n');
}

/**
 * Update a specific key in the irc channel object
 *
 * @param channelName the irc channel name
 * @param key the key to update in the irc channel object
 * @param value the new value to set for the specified key
 */
function updateIrcChannelData(channelName: string, key: string, value: any) {
	const ircChannel = getIrcChannel(channelName);

	if (ircChannel == null) {
		return;
	}

	const updatedIrcChannel = {
		...ircChannel,
		[key]: value
	};

	fs.writeFileSync(getChannelFileName(channelName), JSON.stringify(updatedIrcChannel, null, 4), 'utf-8');
}

export function registerIrcHandlers(allWindows: WindowManager[]) {
	/**
	 * Create a new irc channel
	 *
	 * Creates 2 files, one for the channel data (json) and one for the messages (ndjson)
	 * Initializes message streams for the channel so that messages can be appended to the file
	 */
	ipcMain.handle(IPC_CHANNELS.CREATE_IRC_CHANNEL, async (event, channelName, ircChannel) => {
		const filePath = getChannelFileName(channelName);
		const messagesFilePath = getChannelMessagesFileName(channelName);

		if (fs.existsSync(filePath)) {
			return false;
		}
		else {
			fs.writeFileSync(filePath, JSON.stringify(ircChannel, null, 4), 'utf-8');
			fs.writeFileSync(messagesFilePath, '', 'utf-8');

			initMessageStreams(channelName);

			return true;
		}
	});

	/**
	 * Get a specific irc channel
	 */
	ipcMain.handle(IPC_CHANNELS.GET_IRC_CHANNEL, async (event, channelName) => {
		return getIrcChannel(channelName);
	});

	/**
	 * Get all irc channels
	 *
	 * Initializes message streams for each channel so that messages can be appended to the file
	 */
	ipcMain.handle(IPC_CHANNELS.GET_ALL_IRC_CHANNELS, async () => {
		const channels: any = {};
		const files = fs.readdirSync(channelsDir);

		for (const file of files) {
			if (file.endsWith('.json')) {
				const channelName = path.basename(file, '.json');
				const ircChannel = initializeAndGetIrcChannel(channelName);

				channels[channelName] = ircChannel;
			}
		}

		return channels;
	});

	/**
	 * Delete a specific irc channel
	 *
	 * Deletes both the channel data file and the messages file
	 * Closes and deletes the message stream if it exists
	 */
	ipcMain.handle(IPC_CHANNELS.DELETE_IRC_CHANNEL, async (event, channelName) => {
		const filePath = getChannelFileName(channelName);
		const messagesFilePath = getChannelMessagesFileName(channelName);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		if (fs.existsSync(messagesFilePath)) {
			fs.unlinkSync(messagesFilePath);
		}

		// Close and delete message stream if it exists
		if (streams[channelName]) {
			streams[channelName].end();
			delete streams[channelName];
		}
	});

	/**
	 * Add an outgoing message to a specific irc channel
	 *
	 * Messages will always be added, regardless of which window sent the message
	 */
	ipcMain.handle(IPC_CHANNELS.ADD_OUTGOING_IRC_MESSAGE, async (event, channelName, message, plainMessage) => {
		writeMessageToIrcChannel(channelName, message, plainMessage);
	});

	/**
	 * Add a message to a specific irc channel
	 *
	 * Messages will only be added from the main-window to avoid duplicate messages
	 */
	ipcMain.handle(IPC_CHANNELS.ADD_IRC_MESSAGE, async (event, channelName, message, plainMessage) => {
		if (event.sender.id !== allWindows[0].win?.webContents.id)
			return;

		writeMessageToIrcChannel(channelName, message, plainMessage);
	});

	/**
	 * Set the label of an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_CHANNEL_LABEL, async (event, channelName, label) => {
		updateIrcChannelData(channelName, 'label', label);
	});

	/**
	 * Set whether to play sound on message for an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_PLAY_SOUND_ON_MESSAGE, async (event, channelName, playSound) => {
		updateIrcChannelData(channelName, 'playSoundOnMessage', playSound);
	});

	/**
	 * Change the last active IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.CHANGE_LAST_ACTIVE_CHANNEL, async (event, channelName, active) => {
		updateIrcChannelData(channelName, 'lastActiveChannel', active);
	});

	/**
	 * Change the active status of an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.CHANGE_ACTIVE_CHANNEL, async (event, channelName, active) => {
		updateIrcChannelData(channelName, 'active', active);
	});
}

app.on('before-quit', () => {
	for (const channelName in streams) {
		streams[channelName].end();
	}
});
