import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";

import fs from "fs";
import path from "path";
import archiver from "archiver";

export function registerUiHandlers(win: BrowserWindow) {
	ipcMain.handle(IPC_CHANNELS.SHOW_SAVE_DIALOG, async (event, options) => dialog.showSaveDialog(win, options));
	ipcMain.handle(IPC_CHANNELS.FLASH_WINDOW, () => win.flashFrame(true));
	ipcMain.handle(IPC_CHANNELS.OPEN_LINK, (event, url) => shell.openExternal(url));

	ipcMain.handle(IPC_CHANNELS.SAVE_SETTINGS_ZIP, async (event, filePath) => {
		const settingsDir = path.join(app.getPath('userData'), 'data');
		const credentialsFilePath = "irc-authentication-store.json";

		return new Promise<void>((resolve, reject) => {
			const output = fs.createWriteStream(filePath);
			const archive = archiver('zip', { zlib: { level: 9 } });

			output.on('close', () => resolve());
			archive.on('error', (err: any) => reject(err));

			archive.pipe(output);

			archive.glob('**/*', {
				cwd: settingsDir,
				ignore: [credentialsFilePath]
			});

			archive.finalize();
		});
	});
}
