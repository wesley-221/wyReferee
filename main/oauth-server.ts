import { BrowserWindow, shell } from 'electron';
import * as express from 'express';
import * as http from 'http';
import { IPC_CHANNELS } from '../src/shared/ipc-channels';

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
	async startServer(oauthUrl: string) {
		this.stopServer();

		const expressServer = express();

		expressServer.get('/osu-oauth-callback', (req, res) => {
			if (this.win) {
				this.win.webContents.send(IPC_CHANNELS.ON_OSU_OAUTH_CODE, req.query.code);
			}

			res.send('Authentication successful! You can now close this window.');

			this.stopServer();
		});

		this.server = expressServer.listen(DEFAULT_PORT, () => {
			console.log(`Started local server on http://localhost:${DEFAULT_PORT}`);

			if (this.win) {
				shell.openExternal(oauthUrl);
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
