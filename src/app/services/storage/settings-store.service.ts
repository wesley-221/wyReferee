import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { BehaviorSubject } from 'rxjs';

interface AppSettings {
	cacheVersion: string;
	version: string;
	dividerHeight: number;
	showAxs: boolean;
	splitBanchoMessages: boolean;
	[key: string]: any;
}

const DEFAULT_SETTINGS: AppSettings = {
	cacheVersion: undefined,
	version: undefined,
	dividerHeight: 30,
	showAxs: false,
	splitBanchoMessages: false
};

@Injectable({
	providedIn: 'root'
})
export class SettingsStoreService {
	private settings$ = new BehaviorSubject<AppSettings | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadSettings();
	}

	/**
	 * Retrieves the value of a specific setting
	 *
	 * @param key key of the setting to retrieve
	 */
	get(key: keyof AppSettings) {
		const current = this.settings$.value;

		if (!current) throw new Error('Settings not loaded yet');

		return current[key];
	}

	/**
	 * Sets the value of a specific setting
	 *
	 * @param key key of the setting to update
	 * @param value new value for the setting
	 */
	set(key: keyof AppSettings, value: any) {
		const current = this.settings$.value;

		if (!current) throw new Error('Settings not loaded yet');

		const newSettings = { ...current, [key]: value };
		this.settings$.next(newSettings);
		this.storage.writeJSON(this.storage.settingsFilePath, newSettings);
	}

	/**
	 * Returns an observable that emits the current settings
	 */
	watchSettings() {
		return this.settings$.asObservable();
	}

	/**
	 * Loads settings from storage and initializes the BehaviorSubject
	 */
	private async loadSettings() {
		const loadedSettings = await this.storage.readJSON<AppSettings>(this.storage.settingsFilePath, DEFAULT_SETTINGS);
		const settings = { ...DEFAULT_SETTINGS, ...loadedSettings };

		this.settings$.next(settings);
	}
}
