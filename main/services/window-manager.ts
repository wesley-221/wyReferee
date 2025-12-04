import { BrowserWindow, screen } from "electron";
import { pathToFileURL } from "url";
import * as path from "path";

export class WindowManager {
	win: BrowserWindow | null = null;

	constructor(private serve: boolean) { }

	createWindow() {
		const size = screen.getPrimaryDisplay().workAreaSize;

		this.win = new BrowserWindow({
			x: 0,
			y: 0,
			width: size.width * 0.75,
			height: size.height * 0.75,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false,
				preload: path.join(__dirname, '../preload.js')
			},
			icon: path.join(__dirname, '../../angular/assets/images/icon.png')
		});

		this.win.setMenuBarVisibility(false);

		if (this.serve) {
			require('electron-reload')(__dirname, {
				electron: require(path.join(__dirname, '../../../node_modules/electron'))
			});

			this.win.loadURL('http://localhost:4200');

			this.win.webContents.on('did-finish-load', () => {
				this.win?.webContents.openDevTools();
			});
		}
		else {
			const fullPath = path.join(__dirname, '../../angular/index.html');
			const url = pathToFileURL(fullPath).toString();

			this.win.loadURL(url);
		}

		return this.win;
	}
}
