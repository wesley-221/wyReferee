import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";

export function registerUiHandlers(win: BrowserWindow) {
	ipcMain.handle(IPC_CHANNELS.SHOW_SAVE_DIALOG, async (event, options) => dialog.showSaveDialog(win, options));
	ipcMain.handle(IPC_CHANNELS.FLASH_WINDOW, () => win.flashFrame(true));
	ipcMain.handle(IPC_CHANNELS.OPEN_LINK, (event, url) => shell.openExternal(url));
}
