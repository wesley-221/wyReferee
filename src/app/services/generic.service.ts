import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsStoreService } from './storage/settings-store.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	private showAxSMenu$: BehaviorSubject<boolean>;
	private cacheCheck$: BehaviorSubject<boolean>;

	constructor(private settingsStore: SettingsStoreService) {
		settingsStore.watchSettings().subscribe(settings => {
			if (settings) {
				this.showAxSMenu$.next(settings.showAxs);
			}
		});

		this.showAxSMenu$ = new BehaviorSubject(false);
		this.cacheCheck$ = new BehaviorSubject(false);
	}

	/**
	 * Hide or show the AxS menu item
	 *
	 * @param active the status of the AxS menu
	 */
	setAxSMenu(active: boolean): void {
		this.showAxSMenu$.next(active);
		this.settingsStore.set('showAxs', active);
	}

	/**
	 * Get the status of the AxS menu item
	 */
	getAxSMenuStatus(): BehaviorSubject<boolean> {
		return this.showAxSMenu$;
	}

	/**
	 * Set the status of the cache check
	 *
	 * @param active the status of the cache check
	 */
	setCacheHasBeenChecked(active: boolean): void {
		this.cacheCheck$.next(active);
	}

	/**
	 * Get the status of the cache check
	 */
	getCacheHasBeenChecked(): BehaviorSubject<boolean> {
		return this.cacheCheck$;
	}
}
