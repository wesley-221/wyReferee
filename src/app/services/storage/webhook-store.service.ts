import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageDriverService } from './storage-driver.service';

interface WebhookStore {
	authorImage: string;
	authorName: string;
	bottomImage: string;
	footerIconUrl: string;
	footerText: string;
	[key: string]: any;
}

const DEFAULT_WEBHOOK_SETTINGS: WebhookStore = {
	authorImage: '',
	authorName: '',
	bottomImage: '',
	footerIconUrl: '',
	footerText: ''
};

@Injectable({
	providedIn: 'root'
})
export class WebhookStoreService {
	private webhookSettings$ = new BehaviorSubject<WebhookStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadWebhookSettings();
	}

	/**
	 * Retrieves the value of a specific setting
	 *
	 * @param key key of the setting to retrieve
	 */
	get(key: keyof WebhookStore) {
		const current = this.webhookSettings$.value;

		if (!current) throw new Error('Webhook settings not loaded yet');

		return current[key];
	}

	/**
	 * Sets the value of a specific setting
	 *
	 * @param key key of the setting to update
	 * @param value new value for the setting
	 */
	set(key: keyof WebhookStore, value: any) {
		const current = this.webhookSettings$.value;

		if (!current) throw new Error('Webhook settings not loaded yet');

		const newSettings = { ...current, [key]: value };
		this.webhookSettings$.next(newSettings);
		this.storage.writeJSON(this.storage.webhookSettingsFilePath, newSettings);
	}

	/**
	 * Returns an observable that emits the current settings
	 */
	watchWebhookSettings() {
		return this.webhookSettings$.asObservable();
	}

	/**
	 * Loads settings from storage and initializes the BehaviorSubject
	 */
	private async loadWebhookSettings() {
		const loadedSettings = await this.storage.readJSON<WebhookStore>(this.storage.webhookSettingsFilePath, DEFAULT_WEBHOOK_SETTINGS);
		const settings = { ...DEFAULT_WEBHOOK_SETTINGS, ...loadedSettings };

		this.webhookSettings$.next(settings);
	}
}
