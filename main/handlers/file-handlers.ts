import { ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";
import * as fs from "fs/promises";

export function registerFileHandlers() {
	ipcMain.handle(IPC_CHANNELS.WRITE_FILE, async (event, filePath, data) => fs.writeFile(filePath, JSON.stringify(data), 'utf8'));
	ipcMain.handle(IPC_CHANNELS.READ_FILE, async (event, filePath, defaultValue) => {
		try {
			const content = await fs.readFile(filePath, 'utf8');
			return JSON.parse(content);
		}
		catch (error) {
			if (defaultValue !== undefined) {
				await fs.writeFile(filePath, JSON.stringify(defaultValue), 'utf8');
				return defaultValue;
			}
		}
	});

	ipcMain.handle(IPC_CHANNELS.DELETE_FILE, async (event, filePath) => {
		try {
			await fs.unlink(filePath);
		}
		catch (error) {
			console.error(`Failed to delete file at ${filePath}:`, error);
		}
	});

	ipcMain.handle(IPC_CHANNELS.LIST_FILES, async (event, filePath) => {
		try {
			const files = await fs.readdir(filePath);
			return files;
		}
		catch (error) {
			return [];
		}
	});

	ipcMain.handle(IPC_CHANNELS.CREATE_DIRECTORY_IF_NOT_EXISTS, async (event, directoryPath) => {
		try {
			await fs.access(directoryPath);
		}
		catch (error) {
			await fs.mkdir(directoryPath, {
				recursive: true
			});
		}
	});
}
