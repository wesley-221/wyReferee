import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageDriverService {
	mainDataPath: string;
	chatLogPath: string;
	lobbyPath: string;
	tournamentPath: string;
	cachePath: string;
	settingsFilePath: string;

	private appDataPath: string;
	private initialized = false;

	constructor() { }

	/**
	 * Writes data to a file
	 *
	 * @param filePath the path to the file to write
	 * @param data the data to write to the file
	 */
	async writeJSON(filePath: string, data: any): Promise<void> {
		await window.electronApi.writeFile(filePath, data);
	}

	/**
	 * Reads a JSON file and returns its content as an object
	 *
	 * @param filePath the path to the file to read
	 * @param defaultValue the default value to return if the file does not exist or cannot be read
	 */
	async readJSON<T>(filePath: string, defaultValue?: any): Promise<T> {
		const content = await window.electronApi.readFile(filePath, defaultValue);
		return content as T;
	}

	/**
	 * Deletes a file
	 *
	 * @param filePath the path to the file to delete
	 */
	async deleteFile(filePath: string) {
		window.electronApi.deleteFile(filePath);
	}

	/**
	 * Lists all files in a directory
	 *
	 * @param filePath the path to directory to list files from
	 */
	async listFiles(filePath: string) {
		return await window.electronApi.listFiles(filePath);
	}

	/**
	 * Joins all given paths together
	 *
	 * @param paths the paths to join
	 */
	public async joinPath(...paths: string[]): Promise<string> {
		return await window.electronApi.joinPath([...paths]);
	}

	/**
	 * Initializes the storage driver service, setting up paths and ensuring directories exist
	 * Used in the app module to ensure storage is ready before the app starts
	 */
	public async init(): Promise<void> {
		if (this.initialized) return;

		this.appDataPath = await window.electronApi.getAppDataPath();

		this.mainDataPath = await this.joinPath(this.appDataPath, 'data');
		this.chatLogPath = await this.joinPath(this.mainDataPath, 'chatlogs');
		this.lobbyPath = await this.joinPath(this.mainDataPath, 'lobbies');
		this.tournamentPath = await this.joinPath(this.mainDataPath, 'tournaments');
		this.cachePath = await this.joinPath(this.mainDataPath, 'cache');

		this.settingsFilePath = await this.joinPath(this.mainDataPath, 'settings.json');

		await this.createRequiredDirectories();

		this.initialized = true;
	}

	/**
	 * Creates all required directories for the application
	 */
	private async createRequiredDirectories() {
		await this.createDirectoryIfNotExists(this.chatLogPath);
		await this.createDirectoryIfNotExists(this.lobbyPath);
		await this.createDirectoryIfNotExists(this.tournamentPath);
		await this.createDirectoryIfNotExists(this.cachePath);
	}

	/**
	 * Creates a directory if it does not exist
	 *
	 * @param dir the directory to create if it doesn't exist
	 */
	private async createDirectoryIfNotExists(directoryPath: string) {
		window.electronApi.createDirectoryIfNotExists(directoryPath);
	}
}
