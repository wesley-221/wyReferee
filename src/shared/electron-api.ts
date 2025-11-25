import { IrcChannel } from "app/models/irc/irc-channel";
import { IrcMessage } from "app/models/irc/irc-message";
import { ProgressInfo } from "electron-updater";

export interface ElectronApi {
	getAppDataPath(): Promise<string>;
	joinPath(paths: string[]): Promise<string>;
	readFile(filePath: string, defaultValue?: any): Promise<any>;
	writeFile(filePath: string, data: any): Promise<void>;
	deleteFile(filePath: string): Promise<void>;
	listFiles(filePath: string): Promise<string[]>;
	createDirectoryIfNotExists(directoryPath: string): Promise<void>;
	showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
	saveSettingsZip(filePath: string): Promise<void>;
	flashWindow(): void;
	startExpressServer(oauthUrl: string): Promise<void>;
	onOsuOauthCode(callback: (code: string) => void): void;
	openLink(url: string): void;
	checkForUpdatesAndNotify(): void;
	updateAvailable(callback: () => void): void;
	updateDownloaded(callback: () => void): void;
	onUpdateError(callback: (error: string) => void): void;
	updateDownloadProgress(callback: (progress: ProgressInfo) => void): void;
	restartAppAfterUpdateDownload(): void;
	irc: ElectronApiIrc;
}

export interface ElectronApiIrc {
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
};
