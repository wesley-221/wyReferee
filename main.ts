import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { OauthServer } from './oauth-server';

let win: BrowserWindow | null;
let serve: boolean;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

let osuOauthServer: OauthServer;

function createWindow() {
	const size = screen.getPrimaryDisplay().workAreaSize;

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
			// preload: path.join(__dirname, 'preload.js')
		},
		icon: `${__dirname}/src/assets/images/icon.png`,
		// frame: false,
		// titleBarStyle: 'hidden'
	});

	win.setMenuBarVisibility(false);

	if (serve) {
		require('electron-reload')(__dirname, {
			electron: require(`${__dirname}/node_modules/electron`)
		});

		win.loadURL('http://localhost:4200');
	} else {
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/index.html'),
			protocol: 'file:',
			slashes: true
		}));
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

	ipcMain.on('start-express-server', () => {
		osuOauthServer.startServer();
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
