import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import { pathToFileURL } from 'url';
import * as path from 'path';
import * as fs from 'fs/promises';

import { OauthServer } from './oauth-server';
import { IPC_CHANNELS } from '../src/shared/ipc-channels';

let win: BrowserWindow | null;
let serve: boolean;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

let osuOauthServer: OauthServer;

function createWindow() {
	const size = screen.getPrimaryDisplay().workAreaSize;
	const baseDirectory = path.join(__dirname, '..');

	// Create the browser window.
	win = new BrowserWindow({
		x: 0,
		y: 0,
		width: size.width * 0.75,
		height: size.height * 0.75,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js')
		},
		icon: path.join(baseDirectory, 'src/assets/images/icon.png'),
		// frame: false,
		// titleBarStyle: 'hidden'
	});

	win.setMenuBarVisibility(false);

	if (serve) {
		require('electron-reload')(__dirname, {
			electron: require(path.join(baseDirectory, 'node_modules/electron'))
		});

		win.loadURL('http://localhost:4200');
	}
	else {
		const fullPath = path.join(baseDirectory, 'dist/index.html');
		const url = pathToFileURL(fullPath).toString();

		win.loadURL(url);
	}

	if (serve) {
		win.webContents.openDevTools();
	}

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store window
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	osuOauthServer = new OauthServer(win);

	ipcMain.handle(IPC_CHANNELS.START_EXPRESS_SERVER, (event, oauthUrl) => {
		osuOauthServer.startServer(oauthUrl);
	});

	// Handle IPC calls
	ipcMain.handle(IPC_CHANNELS.GET_APP_DATA_PATH, () => {
		return app.getPath('userData');
	});

	ipcMain.handle(IPC_CHANNELS.JOIN_PATH, (event, options) => {
		return path.join(...options);
	});

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

	ipcMain.handle(IPC_CHANNELS.WRITE_FILE, async (event, filePath, data) => {
		return fs.writeFile(filePath, JSON.stringify(data), 'utf8');
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

	ipcMain.handle(IPC_CHANNELS.SHOW_SAVE_DIALOG, async (event, options) => {
		if (win) {
			return dialog.showSaveDialog(win, options);
		}
	});

	ipcMain.handle(IPC_CHANNELS.FLASH_WINDOW, () => {
		if (win) {
			win.flashFrame(true);
		}
	});
}

try {
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', createWindow);

	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) {
			createWindow();
		}
	});


} catch (e) {
	// Catch Error
	// throw e;
}
