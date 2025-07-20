export interface ElectronApi {
	getAppDataPath(): Promise<string>;
	joinPath(paths: string[]): Promise<string>;
	readFile(filePath: string, defaultValue?: any): Promise<any>;
	writeFile(filePath: string, data: any): Promise<void>;
	deleteFile(filePath: string): Promise<void>;
	listFiles(filePath: string): Promise<string[]>;
	createDirectoryIfNotExists(directoryPath: string): Promise<void>;
	showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
}
