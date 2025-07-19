import { BrowserWindow } from 'electron';
import * as express from 'express';
import * as http from 'http';

const DEFAULT_PORT = 3000;

export class OauthServer {
	server: http.Server | null;
	win: BrowserWindow | null;

	constructor(win: BrowserWindow | null) {
		this.win = win;
	}

	/**
	 * Starts a local Express server to handle the `/osu-oauth-callback` route for OAuth.
	 */
	async startServer() {
		this.stopServer();

		const expressServer = express();

		expressServer.get('/osu-oauth-callback', (req, res) => {
			if (this.win) {
				this.win.webContents.send('osu-oauth-code', req.query.code);
			}

			res.send('Authentication successful! You can now close this window.');

			this.stopServer();
		});

		this.server = expressServer.listen(DEFAULT_PORT, () => {
			console.log(`Started local server on http://localhost:${DEFAULT_PORT}`);

			if (this.win) {
				this.win.webContents.send('express-server-started', true);
			}
		});
	}

	/**
	 * Stops the local Express server if it is running.
	 */
	stopServer() {
		if (this.server) {
			this.server.close(() => {
				console.log('Stopped local server');
			});

			this.server = null;
		}
	}
}
