import { app, BrowserWindow, ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";
import * as path from "path";
import { OauthServer } from "../oauth/oauth-server";
import { registerFileHandlers } from "../handlers/file-handlers";
import { registerUiHandlers } from "../handlers/ui-handlers";
import { WindowManager } from "./window-manager";
import { registerIrcHandlers } from "../handlers/irc-handlers";
import { registerIrcAuthenticationHandlers } from "../handlers/irc-authentication-handlers";
import { registerDataMigrationHandler } from "./data-migration-handler";
import { registerWebhookHandlers } from "../handlers/webhook-handlers";

export function setupIpcHandlers(win: BrowserWindow, osuOauthServer: OauthServer, allWindows: WindowManager[]) {
	ipcMain.handle(IPC_CHANNELS.GET_APP_DATA_PATH, () => app.getPath('userData'));
	ipcMain.handle(IPC_CHANNELS.JOIN_PATH, (event, options) => path.join(...options));

	ipcMain.handle(IPC_CHANNELS.START_EXPRESS_SERVER, (event, oauthUrl) => {
		osuOauthServer.startServer(oauthUrl);
	});

	registerDataMigrationHandler(win);
	registerFileHandlers();
	registerUiHandlers(win);
	registerIrcHandlers(allWindows);
	registerWebhookHandlers(allWindows);
	registerIrcAuthenticationHandlers();
}
