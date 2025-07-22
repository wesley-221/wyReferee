export const IPC_CHANNELS = {
	GET_APP_DATA_PATH: 'getAppDataPath',
	JOIN_PATH: 'joinPath',
	READ_FILE: 'readfile',
	WRITE_FILE: 'writefile',
	DELETE_FILE: 'deletefile',
	LIST_FILES: 'listFiles',
	CREATE_DIRECTORY_IF_NOT_EXISTS: 'createDirectoryIfNotExists',
	SHOW_SAVE_DIALOG: 'showSaveDialog',
	FLASH_WINDOW: 'flashWindow',
	START_EXPRESS_SERVER: 'startExpressServer',
	ON_OSU_OAUTH_CODE: 'onOsuOauthCode',
	OPEN_LINK: 'openLink',
	CHECK_FOR_UPDATES_AND_NOTIFY: 'checkForUpdatesAndNotify',
	UPDATE_AVAILABLE: 'update-available',
	UPDATE_DOWNLOADED: 'update-downloaded',
	UPDATE_ERROR: 'error',
	RESTART_APP_AFTER_UPDATE_DOWNLOAD: 'restartAppAfterUpdateDownload',
	UPDATE_DOWNLOAD_PROGRESS: 'download-progress'
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
