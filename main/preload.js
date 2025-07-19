const { ipcRenderer } = require('electron');
const { IPC_CHANNELS } = require('../src/shared/ipc-channels');

window.electronApi = {
	getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH)
};
