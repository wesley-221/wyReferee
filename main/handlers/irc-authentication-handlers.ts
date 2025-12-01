import { app, ipcMain, safeStorage } from "electron";

import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { IPC_CHANNELS } from "../ipc-channels";

const ircAuthFilePath = path.join(app.getPath('userData'), 'data', 'osu-credentials.bin');

app.on('ready', () => {
	// Create the file with default empty values if it doesn't exist
	if (!fs.existsSync(ircAuthFilePath)) {
		const defaultData = {
			username: '',
			password: '',
			apiKey: ''
		}

		fs.writeFileSync(ircAuthFilePath, encrypt(defaultData), 'utf-8');
	}
});

export function registerIrcAuthenticationHandlers() {
	/**
	 * Get the stored irc credentials
	 */
	ipcMain.handle(IPC_CHANNELS.GET_IRC_CREDENTIALS, async (event) => {
		return getDecryptedIrcAuthData();
	});

	/**
	 * Get the stored irc username
	 */
	ipcMain.handle(IPC_CHANNELS.GET_IRC_USERNAME, async (event) => {
		const currentData = getDecryptedIrcAuthData();
		return currentData.username;
	});

	/**
	 * Get the stored api key
	 */
	ipcMain.handle(IPC_CHANNELS.GET_API_KEY, async (event) => {
		const currentData = getDecryptedIrcAuthData();
		return currentData.apiKey;
	});

	/**
	 * Update the api key in storage
	 */
	ipcMain.handle(IPC_CHANNELS.SET_API_KEY, async (event, apiKey: string) => {
		const currentData = getDecryptedIrcAuthData();

		currentData.apiKey = apiKey;

		await fsPromises.writeFile(ircAuthFilePath, encrypt(currentData), 'utf-8');
	});

	/**
	 * Update the irc login credentials in storage
	 */
	ipcMain.handle(IPC_CHANNELS.SET_IRC_LOGIN, async (event, username: string, password: string) => {
		const currentData = getDecryptedIrcAuthData();

		currentData.username = username;
		currentData.password = password;

		await fsPromises.writeFile(ircAuthFilePath, encrypt(currentData), 'utf-8');
	});

	/**
	 * Clear the stored irc login credentials
	 */
	ipcMain.handle(IPC_CHANNELS.CLEAR_IRC_LOGIN, async (event) => {
		const currentData = getDecryptedIrcAuthData();

		currentData.username = '';
		currentData.password = '';

		await fsPromises.writeFile(ircAuthFilePath, encrypt(currentData), 'utf-8');
	});

	/**
	 * Clear the stored api key
	 */
	ipcMain.handle(IPC_CHANNELS.CLEAR_API_KEY, async (event) => {
		const currentData = getDecryptedIrcAuthData();

		currentData.apiKey = '';

		await fsPromises.writeFile(ircAuthFilePath, encrypt(currentData), 'utf-8');
	});
}

/**
 * Read and decrypt the irc authentication data from storage
 */
function getDecryptedIrcAuthData() {
	const fileContent = fs.readFileSync(ircAuthFilePath);
	const stringValue = safeStorage.decryptString(fileContent);

	return JSON.parse(stringValue);
}

/**
 * Encrypt a value for storage
 *
 * @param value the value to encrypt
 */
function encrypt(value: any) {
	const stringValue = JSON.stringify(value);

	return safeStorage.encryptString(stringValue);
}

