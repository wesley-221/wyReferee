import { app } from 'electron';

import { OauthServer } from './oauth/oauth-server';
import { WindowManager } from './services/window-manager';
import { setupIpcHandlers } from './services/ipc-handler';
import { SqliteHandler } from './services/sqlite-handler';

let windowManager: WindowManager;

app.whenReady().then(async () => {
	const serve = process.argv.includes('--serve');
	windowManager = new WindowManager(serve);

	const win = windowManager.createWindow();

	if (!serve) {
		const { UpdateManager } = await import('./services/update-manager');

		new UpdateManager(win);
	}

	const osuOauthServer = new OauthServer(win);
	setupIpcHandlers(win, osuOauthServer);

	const sqliteHandler = new SqliteHandler();
	sqliteHandler.createDatabase();
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
