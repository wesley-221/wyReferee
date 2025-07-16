import { Injectable } from '@angular/core';
import { ToastType } from 'app/models/toast';
import { BehaviorSubject } from 'rxjs';
import { ApiKeyValidation } from './osu-api/api-key-validation.service';
import { StoreService } from './store.service';
import { ToastService } from './toast.service';
import { SettingsStoreService } from './storage/settings-store.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	private showAxSMenu$: BehaviorSubject<boolean>;
	private cacheCheck$: BehaviorSubject<boolean>;
	private splitBanchoMessages$: BehaviorSubject<boolean>;

	constructor(private settingsStore: SettingsStoreService, private storeService: StoreService, private apiKeyValidation: ApiKeyValidation, private toastService: ToastService) {
		settingsStore.watchSettings().subscribe(settings => {
			if (settings) {
				this.showAxSMenu$.next(settings.showAxs);
				this.splitBanchoMessages$.next(settings.splitBanchoMessages);
			}
		});

		this.showAxSMenu$ = new BehaviorSubject(false);
		this.cacheCheck$ = new BehaviorSubject(false);
		this.splitBanchoMessages$ = new BehaviorSubject(false);

		const apiKey = this.storeService.get('api-key');

		if (apiKey != undefined && apiKey != null) {
			this.apiKeyValidation.validate(apiKey).subscribe(() => {
				console.log('Valid api-key provided');
			}, () => {
				this.storeService.delete('api-key');
				this.toastService.addToast('The api key you have saved is invalid. Your api key has been deleted, in 10 seconds the application will restart and you will have to re-enter your api key on the settings page.', ToastType.Error, 10);

				setTimeout(() => {
					window.location.reload();
				}, 10000);
			});
		}
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

	/**
	 * Split the Bancho messages or not
	 *
	 * @param active the status of the AxS menu
	 */
	setSplitBanchoMessages(active: boolean): void {
		this.splitBanchoMessages$.next(active);
		this.settingsStore.set('splitBanchoMessages', active);
	}

	/**
	 * Get the status of whether to split Bancho messages or not
	 */
	getSplitBanchoMessages(): BehaviorSubject<boolean> {
		return this.splitBanchoMessages$;
	}
}
