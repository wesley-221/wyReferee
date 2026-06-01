import { BrowserWindow, screen } from "electron";
import { pathToFileURL } from "url";
import * as path from "path";

export class WindowManager {
	win: BrowserWindow | null = null;
	ZOOM_MIN = -5;
	ZOOM_MAX = 5;

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

		this.win.webContents.on('before-input-event', (event, input) => {
			if (input.type !== 'keyDown') {
				return;
			}

			if (!input.control && !input.meta) {
				return;
			}

			switch (input.code) {
				case 'Equal':
					this.applyZoom(this.win, 0.5);
					break;

				case 'Minus':
					this.applyZoom(this.win, -0.5);
					break;

				case 'Digit0':
					this.applyZoom(this.win, 0);
					break;
				default:
					return;
			}

			event.preventDefault();
		});

		return this.win;
	}

	private applyZoom(window: BrowserWindow | null, zoomLevel: number) {
		if (window == null) {
			return;
		}

		const win = window?.webContents;

		if (zoomLevel === 0) {
			win?.setZoomLevel(0);
		}
		else {
			const next = win?.zoomLevel + zoomLevel;
			win?.setZoomLevel(Math.min(this.ZOOM_MAX, Math.max(this.ZOOM_MIN, next)));
		}
	}
}
