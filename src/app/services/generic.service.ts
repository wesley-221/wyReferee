import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SettingsStoreService } from './storage/settings-store.service';

@Injectable({
	providedIn: 'root'
})
export class GenericService {
	private showAxSMenu$: BehaviorSubject<boolean>;
	private showIncorrectSlot$: BehaviorSubject<boolean>;
	private splitBanchoBotMessages$: BehaviorSubject<boolean>;
	private chatContainerSwitched$: BehaviorSubject<boolean>;
	private banchoChatContainerHeight$: BehaviorSubject<number>;
	private showAllShortcuts$: BehaviorSubject<boolean>;

	constructor(private settingsStore: SettingsStoreService) {
		settingsStore.watchSettings().subscribe(settings => {
			if (settings) {
				this.showAxSMenu$.next(settings.showAxs);
				this.showIncorrectSlot$.next(settings.showIncorrectSlot);
				this.splitBanchoBotMessages$.next(settings.splitBanchoBotMessages);
				this.chatContainerSwitched$.next(settings.chatContainerSwitched);
				this.banchoChatContainerHeight$.next(settings.banchoChatContainerHeight);
				this.showAllShortcuts$.next(settings.showAllShortcuts);
			}
		});

		this.showAxSMenu$ = new BehaviorSubject(false);
		this.showIncorrectSlot$ = new BehaviorSubject(true);
		this.splitBanchoBotMessages$ = new BehaviorSubject(false);
		this.chatContainerSwitched$ = new BehaviorSubject(false);
		this.banchoChatContainerHeight$ = new BehaviorSubject(30);
		this.showAllShortcuts$ = new BehaviorSubject(false);
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

	/**
	 * Hide or show the splitting of BanchoBot messages
	 *
	 * @param active the status of splitting BanchoBot messages
	 */
	setSplitBanchoBotMessages(active: boolean): void {
		this.splitBanchoBotMessages$.next(active);
		this.settingsStore.set('splitBanchoBotMessages', active);
	}

	/**
	 * Get the status of splitting BanchoBot messages
	 */
	getSplitBanchoBotMessagesStatus(): BehaviorSubject<boolean> {
		return this.splitBanchoBotMessages$;
	}

	/**
	 * Get the status of switching chat containers
	 */
	getChatContainerSwitchStatus(): BehaviorSubject<boolean> {
		return this.chatContainerSwitched$;
	}

	/**
	 * Set the status of switching chat containers
	 *
	 * @param enabled the status of switching chat containers
	 */
	toggleChatContainerSwitch(enabled: boolean): void {
		this.chatContainerSwitched$.next(enabled);
		this.settingsStore.set('chatContainerSwitched', enabled);
	}

	/**
	 * Set the height of the Bancho chat container
	 *
	 * @param height the height of the Bancho chat container
	 */
	setBanchoChatContainerHeight(height: number): void {
		this.banchoChatContainerHeight$.next(height);
		this.settingsStore.set('banchoChatContainerHeight', height);
	}

	/**
	 * Get the height of the Bancho chat container
	 */
	getBanchoChatContainerHeight(): BehaviorSubject<number> {
		return this.banchoChatContainerHeight$;
	}

	/**
	 * Set the width of the IRC sidebars
	 *
	 * @param side which sidebar to set the width of, either 'left' or 'right'
	 * @param width the width of the sidebar in pixels
	 */
	setIrcSidebarWidth(side: 'left' | 'right', width: number): void {
		this.settingsStore.set(`sidebar${side === 'left' ? 'Left' : 'Right'}Width`, width);
	}

	/**
	 * Get the width of the IRC sidebar
	 *
	 * @param side which sidebar to get the width of, either 'left' or 'right'
	 */
	getIrcSidebarWidth(side: 'left' | 'right'): Observable<number> {
		const width = this.settingsStore.get(`sidebar${side === 'left' ? 'Left' : 'Right'}Width`) || 250;

		return of(width);
	}

	/**
	 * Set the status of showing all shortcuts in the shortcuts menu without a scrollbar
	 *
	 * @param active the status of showing all shortcuts
	 */
	setShowAllShortcuts(active: boolean): void {
		console.log(active);
		this.showAllShortcuts$.next(active);
		this.settingsStore.set('showAllShortcuts', active);
	}

	/**
	 * Get the status of showing all shortcuts in the shortcuts menu without a scrollbar
	 */
	getShowAllShortcutsStatus(): BehaviorSubject<boolean> {
		return this.showAllShortcuts$;
	}
}
