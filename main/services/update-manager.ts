import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { logger } from "../utils/logger";
import { IPC_CHANNELS } from "../ipc-channels";

export class UpdateManager {
	constructor(private win: BrowserWindow) {
		this.setup();
	}

	private setup() {
		ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES_AND_NOTIFY, async () => autoUpdater.checkForUpdatesAndNotify());
		autoUpdater.on(IPC_CHANNELS.UPDATE_AVAILABLE, async () => this.win.webContents.send(IPC_CHANNELS.UPDATE_AVAILABLE));
		autoUpdater.on(IPC_CHANNELS.UPDATE_DOWNLOADED, async () => this.win.webContents.send(IPC_CHANNELS.UPDATE_DOWNLOADED));

		autoUpdater.on(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, async (progress) => {
			const safeProgress = {
				percent: progress.percent,
				bytesPerSecond: progress.bytesPerSecond,
				transferred: progress.transferred,
				total: progress.total
			};

			this.win.webContents.send(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, safeProgress);
		});

		autoUpdater.on(IPC_CHANNELS.UPDATE_ERROR, async (error) => {
			logger("Electron auto updater error: " + error);

			const safeError = {
				message: String(error?.message ?? ''),
				name: String(error?.name ?? ''),
				stack: String(error?.stack ?? '')
			};

			this.win.webContents.send(IPC_CHANNELS.UPDATE_ERROR, safeError);
		});

		ipcMain.handle(IPC_CHANNELS.RESTART_APP_AFTER_UPDATE_DOWNLOAD, async () => {
			autoUpdater.quitAndInstall();
		});
	}
}
