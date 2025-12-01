import { ProgressInfo } from "electron-updater";
import { IrcChannel } from "../app/models/irc/irc-channel";
import { IrcMessage } from "../app/models/irc/irc-message";

export interface ElectronApi {
	dataMigration: ElectronDataMigration;
	fs: ElectronApiFs;
	dialog: ElectronApiDialog;
	window: ElectronApiWindow;
	server: ElectronApiServer;
	autoUpdater: ElectronApiAutoUpdater;
	irc: ElectronApiIrc;
	osuAuthentication: ElectronApiOsuAuthentication;
}

interface ElectronDataMigration {
	checkForMigrationsAndNotify(): void;
	restartAppAfterMigration(): void;
	migrationNeeded(callback: (migrationNeeded: boolean) => void): void;
	startDataMigration(migrationOptions: {
		webhookCustomization: boolean;
		tournaments: boolean;
		lobbies: boolean;
		ircChannels: boolean;
		ircShortcutCommands: boolean;
		keepDataBackup: boolean;
	}): Promise<{ status: string; message: string }[]>;
}

interface ElectronApiFs {
	getAppDataPath(): Promise<string>;
	joinPath(paths: string[]): Promise<string>;
	readFile(filePath: string, defaultValue?: any): Promise<any>;
	writeFile(filePath: string, data: any): Promise<void>;
	deleteFile(filePath: string): Promise<void>;
	listFiles(filePath: string): Promise<string[]>;
	createDirectoryIfNotExists(directoryPath: string): Promise<void>;
}

interface ElectronApiDialog {
	showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
	saveSettingsZip(filePath: string): Promise<void>;
}

interface ElectronApiWindow {
	flashWindow(): Promise<void>;
	openLink(url: string): Promise<void>;
}

interface ElectronApiServer {
	startExpressServer(oauthUrl: string): Promise<void>;
	onOsuOauthCode(callback: (code: string) => void): void;
}

interface ElectronApiAutoUpdater {
	checkForUpdatesAndNotify(): void;
	updateAvailable(callback: () => void): void;
	updateDownloaded(callback: () => void): void;
	onUpdateError(callback: (error: string) => void): void;
	updateDownloadProgress(callback: (progress: ProgressInfo) => void): void;
	restartAppAfterUpdateDownload(): void;
}

interface ElectronApiIrc {
	createIrcChannel(channelName: string, ircChannel: IrcChannel): Promise<void>;
	deleteIrcChannel(channelName: string): Promise<void>;
	getAllIrcChannels(): Promise<any>;
	getIrcChannel(channelName: string): Promise<any>;
	setIrcChannelLabel(channelName: string, label: string): Promise<void>;
	setIrcPlaySoundOnMessage(channelName: string, playSound: boolean): Promise<void>;
	changeActiveChannel(channelName: string, active: boolean): Promise<void>;
	changeLastActiveChannel(channelName: string, active: boolean): Promise<void>;
	addIrcMessage(channelName: string, message: IrcMessage, plainMessage: string, saveInBanchoMessages: boolean): Promise<void>;
	addOutgoingIrcMessage(channelName: string, message: IrcMessage, plainMessage: string): Promise<void>;
}

interface ElectronApiOsuAuthentication {
	getIrcCredentials(): Promise<{ username: string, password: string, apiKey: string }>;
	getIrcUsername(): Promise<string>;
	getApiKey(): Promise<string>;
	setApiKey(apiKey: string): Promise<void>;
	setIrcLogin(username: string, password: string): Promise<void>;
	clearIrcLogin(): Promise<void>;
	clearApiKey(): Promise<void>;
}
