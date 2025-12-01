import { ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";
import { WindowManager } from "../services/window-manager";
import { URL } from "url";
import * as https from "https";

export function registerWebhookHandlers(allWindows: WindowManager[]) {
	ipcMain.handle(IPC_CHANNELS.SEND_WEBHOOK, async (event, webhookUrl: string, payload: any) => {
		return sendWebhookRequest(webhookUrl, payload);
	});

	ipcMain.handle(IPC_CHANNELS.SEND_WEBHOOK_MAIN_ONLY, async (event, webhookUrl: string, payload: any) => {
		if (event.sender.id !== allWindows[0].win?.webContents.id)
			return;

		return sendWebhookRequest(webhookUrl, payload);
	});
}

function sendWebhookRequest(webhookUrl: string, payload: any): Promise<void> {
	const url = new URL(webhookUrl);
	const data = JSON.stringify(payload);

	const options = {
		hostname: url.hostname,
		port: 443,
		path: url.pathname + url.search,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(data)
		}
	};

	return new Promise<void>((resolve, reject) => {
		const request = https.request(options, (res) => {
			res.on('data', (d) => {
				console.log(d.toString());
			});

			res.on('end', () => resolve());
		});

		request.on('error', (error) => reject(error));

		request.write(data);
		request.end();
	});
}
