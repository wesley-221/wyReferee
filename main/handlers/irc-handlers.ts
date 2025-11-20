import { ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";
import { WindowManager } from "../services/window-manager";

export function registerIrcHandlers(allWindows: WindowManager[]) {
	const Store = require('electron-store');
	const store = new Store();

	/**
	 * Get all IRC channels
	 */
	ipcMain.handle(IPC_CHANNELS.GET_ALL_IRC_CHANNELS, async () => {
		const channels = store.get('irc.channels') || {};
		return channels;
	});

	/**
	 * Get a specific IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.GET_IRC_CHANNEL, async (event, channelName) => {
		const channel = store.get(`irc.channels.${channelName}`);
		return channel;
	});

	/**
	 * Update all IRC channels
	 */
	ipcMain.handle(IPC_CHANNELS.SET_ALL_IRC_CHANNELS, async (event, channels) => {
		store.set('irc.channels', channels);
	});

	/**
	 * Update a specific IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_CHANNEL, async (event, channelName, channel) => {
		store.set(`irc.channels.${channelName}`, channel);
	});

	/**
	 * Delete a specific IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.DELETE_IRC_CHANNEL, async (event, channelName) => {
		store.delete(`irc.channels.${channelName}`);
	});

	/**
	 * Add an outgoing message to a specific IRC channel
	 * Messages will always be added, regardless of which window sent the message
	 */
	ipcMain.handle(IPC_CHANNELS.ADD_OUTGOING_IRC_MESSAGE, async (event, channelName, message, plainMessage) => {
		const channel = store.get(`irc.channels.${channelName}`);

		channel.messages.push(message);

		if (channel.plainMessageHistory == undefined || channel.plainMessageHistory == null) {
			channel.plainMessageHistory = [];
		}

		channel.plainMessageHistory.push(plainMessage);

		if (channel.plainMessageHistory.length > 20) {
			channel.plainMessageHistory.shift();
		}

		store.set(`irc.channels.${channelName}.messages`, channel.messages);
		store.set(`irc.channels.${channelName}.plainMessageHistory`, channel.plainMessageHistory);
	});

	/**
	 * Add a message to a specific IRC channel
	 * Messages will only be added from the main-window to avoid duplicate messages
	 */
	ipcMain.handle(IPC_CHANNELS.ADD_IRC_MESSAGE, async (event, channelName, message, plainMessage, saveInBanchoMessages) => {
		if (event.sender.id != allWindows[0].win?.webContents.id) {
			return;
		}

		const channel = store.get(`irc.channels.${channelName}`);

		if (saveInBanchoMessages) {
			channel.banchoBotMessages.push(message);

			store.set(`irc.channels.${channelName}.banchoBotMessages`, channel.banchoBotMessages);
		}
		else {
			channel.messages.push(message);

			if (channel.plainMessageHistory == undefined || channel.plainMessageHistory == null) {
				channel.plainMessageHistory = [];
			}

			channel.plainMessageHistory.push(plainMessage);

			if (channel.plainMessageHistory.length > 20) {
				channel.plainMessageHistory.shift();
			}
		}

		store.set(`irc.channels.${channelName}.messages`, channel.messages);
		store.set(`irc.channels.${channelName}.plainMessageHistory`, channel.plainMessageHistory);
	});

	/**
	 * Change the last active IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.CHANGE_LAST_ACTIVE_CHANNEL, async (event, channelName, active) => {
		store.set(`irc.channels.${channelName}.lastActiveChannel`, active);
	});

	/**
	 * Change the active status of an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.CHANGE_ACTIVE_CHANNEL, async (event, channelName, active) => {
		store.set(`irc.channels.${channelName}.active`, active);
	});

	/**
	 * Set whether to play sound on message for an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_PLAY_SOUND_ON_MESSAGE, async (event, channelName, playSound) => {
		store.set(`irc.channels.${channelName}.playSoundOnMessage`, playSound);
	});

	/**
	 * Set the label of an IRC channel
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_CHANNEL_LABEL, async (event, channelName, label) => {
		store.set(`irc.channels.${channelName}.label`, label);
	});
}
