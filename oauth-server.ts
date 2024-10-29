import { BrowserWindow } from 'electron';
import * as express from 'express';
import * as http from 'http';
import * as net from 'net';

const DEFAULT_PORT = 3000;
const FALLBACK_PORT = 4000;

export class OauthServer {
	server: http.Server | null;
	win: BrowserWindow | null;

	constructor(win: BrowserWindow | null) {
		this.win = win;
	}

	/**
	 * Checks if the specified port is available (not in use)
	 *
	 * @param port the port to check
	 * @returns resolves with `true` if the port is available, or `false` if it is in use
	 */
	checkPort(port: number): Promise<boolean> {
		return new Promise((resolve) => {
			const testServer = net.createServer()
				.once('error', () => resolve(false))
				.once('listening', () => {
					testServer.close(() => resolve(true));
				})
				.listen(port);
		});
	}

	/**
	 * Starts a local Express server to handle the `/osu-oauth-callback` route for OAuth.
	 */
	async startServer() {
		this.stopServer();

		let port = DEFAULT_PORT;

		const isAvailable = await this.checkPort(port);

		if (!isAvailable) {
			port = FALLBACK_PORT;
		}

		const expressServer = express();

		expressServer.get('/osu-oauth-callback', (req, res) => {
			if (this.win) {
				this.win.webContents.send('osu-oauth-code', req.query.code);
			}

			res.send('Authentication successful! You can now close this window.');

			this.stopServer();
		});

		this.server = expressServer.listen(port, () => {
			console.log(`Started local server on http://localhost:${port}`);

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
