import { ProgressInfo } from "electron-updater";

import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';

(window as any).electronApi = {
	dataMigration: {
		checkForMigrationsAndNotify: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_FOR_MIGRATIONS_AND_NOTIFY),
		restartAppAfterMigration: () => ipcRenderer.invoke(IPC_CHANNELS.RESTART_APP_AFTER_MIGRATION),
		migrationNeeded: (callback: (migrationNeeded: boolean) => void) => ipcRenderer.on(IPC_CHANNELS.MIGRATION_NEEDED, (event: any, migrationNeeded: boolean) => callback(migrationNeeded)),
		startDataMigration: (migrationOptions: any) => ipcRenderer.invoke(IPC_CHANNELS.START_DATA_MIGRATION, migrationOptions)
	},
	fs: {
		getAppDataPath: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_DATA_PATH),
		joinPath: (paths: string[]) => ipcRenderer.invoke(IPC_CHANNELS.JOIN_PATH, paths),
		readFile: (filePath: string, defaultValue: any) => ipcRenderer.invoke(IPC_CHANNELS.READ_FILE, filePath, defaultValue),
		writeFile: (filePath: string, data: any) => ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, data),
		deleteFile: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_FILE, filePath),
		listFiles: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.LIST_FILES, filePath),
		createDirectoryIfNotExists: (directoryPath: string) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_DIRECTORY_IF_NOT_EXISTS, directoryPath)
	},
	dialog: {
		showSaveDialog: (options: Electron.SaveDialogOptions) => ipcRenderer.invoke(IPC_CHANNELS.SHOW_SAVE_DIALOG, options),
		saveSettingsZip: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTINGS_ZIP, filePath)
	},
	window: {
		flashWindow: () => ipcRenderer.invoke(IPC_CHANNELS.FLASH_WINDOW),
		openLink: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.OPEN_LINK, url)
	},
	server: {
		startExpressServer: (oauthUrl: string) => ipcRenderer.invoke(IPC_CHANNELS.START_EXPRESS_SERVER, oauthUrl),
		onOsuOauthCode: (callback: (code: string) => void) => ipcRenderer.once(IPC_CHANNELS.ON_OSU_OAUTH_CODE, (event: any, code: string) => callback(code))
	},
	autoUpdater: {
		checkForUpdatesAndNotify: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_FOR_UPDATES_AND_NOTIFY),
		updateAvailable: (callback: () => void) => ipcRenderer.on(IPC_CHANNELS.UPDATE_AVAILABLE, () => callback()),
		updateDownloaded: (callback: () => void) => ipcRenderer.on(IPC_CHANNELS.UPDATE_DOWNLOADED, () => callback()),
		onUpdateError: (callback: (error: any) => void) => ipcRenderer.on(IPC_CHANNELS.UPDATE_ERROR, (error: any) => callback(error)),
		updateDownloadProgress: (callback: (progress: any) => void) => ipcRenderer.on(IPC_CHANNELS.UPDATE_DOWNLOAD_PROGRESS, (event: any, progress: ProgressInfo) => callback(progress)),
		restartAppAfterUpdateDownload: () => ipcRenderer.invoke(IPC_CHANNELS.RESTART_APP_AFTER_UPDATE_DOWNLOAD)
	},
	irc: {
		createIrcChannel: (channelName: string, ircChannel: any) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_IRC_CHANNEL, channelName, ircChannel),
		deleteIrcChannel: (channelName: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_IRC_CHANNEL, channelName),
		getAllIrcChannels: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_IRC_CHANNELS),
		getIrcChannel: (channelName: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_IRC_CHANNEL, channelName),
		setIrcChannelLabel: (channelName: string, label: string) => ipcRenderer.invoke(IPC_CHANNELS.SET_IRC_CHANNEL_LABEL, channelName, label),
		setIrcPlaySoundOnMessage: (channelName: string, playSound: boolean) => ipcRenderer.invoke(IPC_CHANNELS.SET_IRC_PLAY_SOUND_ON_MESSAGE, channelName, playSound),
		changeActiveChannel: (channelName: string, active: boolean) => ipcRenderer.invoke(IPC_CHANNELS.CHANGE_ACTIVE_CHANNEL, channelName, active),
		changeLastActiveChannel: (channelName: string, active: boolean) => ipcRenderer.invoke(IPC_CHANNELS.CHANGE_LAST_ACTIVE_CHANNEL, channelName, active),
		addIrcMessage: (channelName: string, message: any, plainMessage: any, saveInBanchoMessages: boolean) => ipcRenderer.invoke(IPC_CHANNELS.ADD_IRC_MESSAGE, channelName, message, plainMessage, saveInBanchoMessages),
		addOutgoingIrcMessage: (channelName: string, message: any, plainMessage: any) => ipcRenderer.invoke(IPC_CHANNELS.ADD_OUTGOING_IRC_MESSAGE, channelName, message, plainMessage)
	},
	osuAuthentication: {
		getIrcCredentials: () => ipcRenderer.invoke(IPC_CHANNELS.GET_IRC_CREDENTIALS),
		getIrcUsername: () => ipcRenderer.invoke(IPC_CHANNELS.GET_IRC_USERNAME),
		getApiKey: () => ipcRenderer.invoke(IPC_CHANNELS.GET_API_KEY),
		setApiKey: (apiKey: string) => ipcRenderer.invoke(IPC_CHANNELS.SET_API_KEY, apiKey),
		setIrcLogin: (username: string, password: string) => ipcRenderer.invoke(IPC_CHANNELS.SET_IRC_LOGIN, username, password),
		clearIrcLogin: () => ipcRenderer.invoke(IPC_CHANNELS.CLEAR_IRC_LOGIN),
		clearApiKey: () => ipcRenderer.invoke(IPC_CHANNELS.CLEAR_API_KEY)
	},
	webhook: {
		sendWebhook: (webhookUrl: string, payload: any) => ipcRenderer.invoke(IPC_CHANNELS.SEND_WEBHOOK, webhookUrl, payload),
		sendWebhookMainOnly: (webhookUrl: string, payload: any) => ipcRenderer.invoke(IPC_CHANNELS.SEND_WEBHOOK_MAIN_ONLY, webhookUrl, payload)
	}
};
