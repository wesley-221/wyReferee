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
}
