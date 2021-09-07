import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	private showAxSMenu$: BehaviorSubject<boolean>;
	private cacheCheck$: BehaviorSubject<boolean>;

	constructor(private storeService: StoreService) {
		const showAxSMenu = this.storeService.get('show-axs');
		this.showAxSMenu$ = new BehaviorSubject(showAxSMenu == undefined ? false : showAxSMenu);
		this.cacheCheck$ = new BehaviorSubject(false);
	}

	/**
	 * Hide or show the AxS menu item
	 * @param active the status of the AxS menu
	 */
	setAxSMenu(active: boolean): void {
		this.showAxSMenu$.next(active);
		this.storeService.set('show-axs', active);
	}

	/**
	 * Get the status of the AxS menu item
	 */
	getAxSMenuStatus(): BehaviorSubject<boolean> {
		return this.showAxSMenu$;
	}

	/**
	 * Set the status of the cache check
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
