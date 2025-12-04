import { app, ipcMain, safeStorage } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";

import * as path from "path";
import * as fs from "fs";

export function registerAuthenticationHandlers() {
	const sessionFilePath = path.join(app.getPath('userData'), 'data', 'authentication-session.bin');

	ipcMain.handle(IPC_CHANNELS.GET_SESSION, async (event) => {
		try {
			const sessionData = fs.readFileSync(sessionFilePath);
			return safeStorage.decryptString(sessionData);
		}
		catch (error) {
			return null;
		}
	});

	ipcMain.handle(IPC_CHANNELS.SET_SESSION, async (event, session: string) => {
		const encryptedSession = safeStorage.encryptString(session);
		fs.writeFileSync(sessionFilePath, new Uint8Array(encryptedSession));
	});

	ipcMain.handle(IPC_CHANNELS.CLEAR_SESSION, async (event) => {
		try {
			fs.unlinkSync(sessionFilePath);
		}
		catch (error) {
		}
	});
}
