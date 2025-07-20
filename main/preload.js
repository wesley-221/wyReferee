const { ipcRenderer } = require('electron');
const { IPC_CHANNELS } = require('../src/shared/ipc-channels');

window.electronApi = {
	getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH),
	joinPath: (paths) => ipcRenderer.invoke(IPC_CHANNELS.JOIN_PATH, paths),
	readFile: (filePath, defaultValue) => ipcRenderer.invoke(IPC_CHANNELS.READ_FILE, filePath, defaultValue),
	writeFile: (filePath, data) => ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, data)
};
