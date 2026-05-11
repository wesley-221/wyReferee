import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsStoreService } from './storage/settings-store.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	private showAxSMenu$: BehaviorSubject<boolean>;
	private showIncorrectSlot$: BehaviorSubject<boolean>;

	constructor(private settingsStore: SettingsStoreService) {
		settingsStore.watchSettings().subscribe(settings => {
			if (settings) {
				this.showAxSMenu$.next(settings.showAxs);
				this.showIncorrectSlot$.next(settings.showIncorrectSlot);
			}
		});

		this.showAxSMenu$ = new BehaviorSubject(false);
		this.showIncorrectSlot$ = new BehaviorSubject(true);
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
	 * Hide or show the incorrect slot warning
	 *
	 * @param active the status of the incorrect slot warning
	 */
	setShowIncorrectSlot(active: boolean): void {
		this.showIncorrectSlot$.next(active);
		this.settingsStore.set('showIncorrectSlot', active);
	}

	/**
	 * Get the status of the incorrect slot warning
	 */
	getShowIncorrectSlotStatus(): BehaviorSubject<boolean> {
		return this.showIncorrectSlot$;
	}
}
