import { app } from 'electron';

import { OauthServer } from './oauth/oauth-server';
import { WindowManager } from './services/window-manager';
import { setupIpcHandlers } from './services/ipc-handler';

let windowManager: WindowManager;
const gotTheLock = app.requestSingleInstanceLock();

// Check if Electron is already running, if so close the newly opened Electron process
// and open a new window within the first Electron process
if (!gotTheLock) {
	app.quit();
	process.exit(0);
}
else {
	app.on('second-instance', () => {
		createWindow();
	});
}

app.whenReady().then(async () => {
	createWindow();
});

async function createWindow() {
	const serve = process.argv.includes('--serve');
	windowManager = new WindowManager(serve);

	const win = windowManager.createWindow();

	if (!serve) {
		const { UpdateManager } = await import('./services/update-manager');

		new UpdateManager(win);
	}

	const osuOauthServer = new OauthServer(win);

	setupIpcHandlers(win, osuOauthServer);
}

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
