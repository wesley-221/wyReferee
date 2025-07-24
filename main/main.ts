import { app } from 'electron';

import { OauthServer } from './oauth/oauth-server';
import { WindowManager } from './services/window-manager';
import { setupIpcHandlers } from './services/ipc-handler';
import { UpdateManager } from './services/update-manager';

let windowManager: WindowManager;

app.whenReady().then(() => {
	const serve = process.argv.includes('--serve');
	windowManager = new WindowManager(serve);

	const win = windowManager.createWindow();

	new UpdateManager(win, serve);

	const osuOauthServer = new OauthServer(win);
	setupIpcHandlers(win, osuOauthServer);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!windowManager.win) {
		windowManager.createWindow();
	}
});
