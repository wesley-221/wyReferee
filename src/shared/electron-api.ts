export interface ElectronApi {
	getAppDataPath(): Promise<string>;
	joinPath(paths: string[]): Promise<string>;
}
