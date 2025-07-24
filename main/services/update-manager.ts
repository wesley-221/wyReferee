import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { logger } from "../utils/logger";
import { IPC_CHANNELS } from "../ipc-channels";

export class UpdateManager {
	constructor(private win: BrowserWindow, private serve: boolean) {
		this.setup();
	}

	private setup() {
		ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES_AND_NOTIFY, () => {
			if (!this.serve) {
				autoUpdater.checkForUpdatesAndNotify();
			}
		});

		autoUpdater.on(IPC_CHANNELS.UPDATE_AVAILABLE, () => {
			this.win.webContents.send(IPC_CHANNELS.UPDATE_AVAILABLE);
		});

		autoUpdater.on(IPC_CHANNELS.UPDATE_DOWNLOADED, () => {
			this.win.webContents.send(IPC_CHANNELS.UPDATE_DOWNLOADED);
		});

		autoUpdater.on(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, (progress) => {
			this.win.webContents.send(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, progress);
		});

		autoUpdater.on(IPC_CHANNELS.UPDATE_ERROR, (error) => {
			logger("Electron auto updater error: " + error);

			this.win.webContents.send(IPC_CHANNELS.UPDATE_ERROR, error);
		});

		ipcMain.handle(IPC_CHANNELS.RESTART_APP_AFTER_UPDATE_DOWNLOAD, () => {
			autoUpdater.quitAndInstall();
		});
	}
}
