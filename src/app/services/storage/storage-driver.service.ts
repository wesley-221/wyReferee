import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageDriverService {
	fs = window.require('fs').promises;
	path = window.require('path');
	appDataPath = window.require('electron').remote.app.getPath('userData');

	mainDataPath: string;
	chatLogPath: string;
	lobbyPath: string;
	tournamentPath: string;
	cachePath: string;

	settingsFilePath: string;

	constructor() {
		this.mainDataPath = this.path.join(this.appDataPath, 'data');
		this.chatLogPath = this.path.join(this.mainDataPath, 'chatlogs');
		this.lobbyPath = this.path.join(this.mainDataPath, 'lobbies');
		this.tournamentPath = this.path.join(this.mainDataPath, 'tournaments');
		this.cachePath = this.path.join(this.mainDataPath, 'cache');

		this.settingsFilePath = this.path.join(this.mainDataPath, 'settings.json');

		this.ensureDirectories();
	}

	/**
	 * Writes data to a file
	 *
	 * @param filePath the path to the file to write
	 * @param data the data to write to the file
	 */
	async writeJSON(filePath: string, data: any): Promise<void> {
		await this.fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
	}

	/**
	 * Reads a JSON file and returns its content as an object
	 *
	 * @param filePath the path to the file to read
	 * @param defaultValue the default value to return if the file does not exist or cannot be read
	 */
	async readJSON<T>(filePath: string, defaultValue?: any): Promise<T> {
		try {
			const content = await this.fs.readFile(filePath, 'utf8');
			return JSON.parse(content) as T;
		}
		catch (error) {
			await this.writeJSON(filePath, defaultValue);
			return defaultValue as T;
		}
	}

	/**
	 * Ensures that the necessary directories exist
	 */
	private async ensureDirectories() {
		await this.ensureDirectoryExists(this.chatLogPath);
		await this.ensureDirectoryExists(this.lobbyPath);
		await this.ensureDirectoryExists(this.tournamentPath);
		await this.ensureDirectoryExists(this.cachePath);
	}

	/**
	 * Ensures that a directory exists, creating it if it does not.
	 *
	 * @param dir the directory to ensure exists
	 */
	private async ensureDirectoryExists(dir: string) {
		try {
			await this.fs.access(dir);
		}
		catch (error) {
			await this.fs.mkdir(dir, {
				recursive: true
			});
		}
	}
}
