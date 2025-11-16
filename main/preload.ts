const { ipcRenderer } = require('electron');
const { IPC_CHANNELS } = require('./ipc-channels');

(window as any).electronApi = {
	getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH),
	joinPath: (paths) => ipcRenderer.invoke(IPC_CHANNELS.JOIN_PATH, paths),
	readFile: (filePath, defaultValue) => ipcRenderer.invoke(IPC_CHANNELS.READ_FILE, filePath, defaultValue),
	writeFile: (filePath, data) => ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, data),
	deleteFile: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_FILE, filePath),
	listFiles: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.LIST_FILES, filePath),
	createDirectoryIfNotExists: (directoryPath) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_DIRECTORY_IF_NOT_EXISTS, directoryPath),
	showSaveDialog: (options) => ipcRenderer.invoke(IPC_CHANNELS.SHOW_SAVE_DIALOG, options),
	saveSettingsZip: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTINGS_ZIP, filePath),
	flashWindow: () => ipcRenderer.invoke(IPC_CHANNELS.FLASH_WINDOW),
	startExpressServer: (oauthUrl) => ipcRenderer.invoke(IPC_CHANNELS.START_EXPRESS_SERVER, oauthUrl),
	onOsuOauthCode: (callback) => ipcRenderer.once(IPC_CHANNELS.ON_OSU_OAUTH_CODE, (event, code) => callback(code)),
	openLink: (url) => ipcRenderer.invoke(IPC_CHANNELS.OPEN_LINK, url),
	checkForUpdatesAndNotify: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_FOR_UPDATES_AND_NOTIFY),
	updateAvailable: (callback) => ipcRenderer.on(IPC_CHANNELS.UPDATE_AVAILABLE, () => callback()),
	updateDownloaded: (callback) => ipcRenderer.on(IPC_CHANNELS.UPDATE_DOWNLOADED, () => callback()),
	onUpdateError: (callback) => ipcRenderer.on(IPC_CHANNELS.UPDATE_ERROR, (error) => callback(error)),
	updateDownloadProgress: (callback) => ipcRenderer.on(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, (event, progress) => callback(progress)),
	restartAppAfterUpdateDownload: () => ipcRenderer.invoke(IPC_CHANNELS.RESTART_APP_AFTER_UPDATE_DOWNLOAD)
};
