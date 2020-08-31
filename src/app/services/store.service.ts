import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
	providedIn: 'root'
})

export class StoreService {
	storage: any;

	constructor(private electronService: ElectronService) {
		if (electronService.isElectron) {
			const Store = window.require('electron-store');
			this.storage = new Store();
		}
	}

	/**
	 * Get data out of the storage with the given key
	 * @param key the key you want to get
	 */
	get(key: string): any {
		return this.storage.get(key);
	}

	/**
	 * Set the data in the storage with the given key/value
	 * @param key the key you want to set
	 * @param value the value you want to set
	 */
	set(key: string, value: any): void {
		this.storage.set(key, value);
	}

	/**
	 * Delete data out of the storage
	 * @param key the key to delete
	 */
	delete(key: string): void {
		this.storage.delete(key);
	}
}
