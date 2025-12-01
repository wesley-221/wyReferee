import { app } from 'electron';

import { OauthServer } from './oauth/oauth-server';
import { WindowManager } from './services/window-manager';
import { setupIpcHandlers } from './services/ipc-handler';

let allWindows: WindowManager[] = [];
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
	const windowManager = new WindowManager(serve);

	windowManager.win = windowManager.createWindow();

	allWindows.push(windowManager);

	if (!serve) {
		const { UpdateManager } = await import('./services/update-manager');

		new UpdateManager(windowManager.win);
	}

	const osuOauthServer = new OauthServer(windowManager.win);

	setupIpcHandlers(windowManager.win, osuOauthServer, allWindows);

	windowManager.win.on('closed', () => {
		windowManager.win = null;

		allWindows.splice(allWindows.indexOf(windowManager), 1);
	});
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (allWindows.length == 0) {
		createWindow();
	}
});
