import { Injectable } from '@angular/core';
import { IrcLayoutSection } from '../../models/irc-layout-section';
import { BehaviorSubject } from 'rxjs';
import { StorageDriverService } from './storage-driver.service';

interface IrcLayoutStore {
	ircLayoutSections: IrcLayoutSection[];
}

@Injectable({
	providedIn: 'root'
})
export class IrcLayoutStoreService {
	private ircLayoutSections$ = new BehaviorSubject<IrcLayoutSection[] | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadIrcLayoutSections();
	}

	/**
	 * Saves all IrcShortcutCommands to the storage
	 *
	 * @param ircLayoutSections the list of IrcLayoutSections to save
	 */
	async saveAllIrcLayoutSections(ircLayoutSections: IrcLayoutSection[]) {
		const current = this.ircLayoutSections$.value;

		if (!current) throw new Error('IrcLayoutSections store not initialized');

		const newIrcLayoutSections: IrcLayoutStore = { ircLayoutSections };

		this.ircLayoutSections$.next(newIrcLayoutSections.ircLayoutSections);
		this.storage.writeJSON(this.storage.ircLayoutSectionsFilePath, newIrcLayoutSections);
	}

	/**
	 * Returns an observable that emits all IrcLayoutSections
	 */
	watchIrcLayoutSections() {
		return this.ircLayoutSections$.asObservable();
	}

	/**
	 * Loads all IrcLayoutSections from storage and initializes the BehaviorSubject
	 */
	private async loadIrcLayoutSections() {
		const loadedIrcLayoutSections = await this.storage.readJSON<IrcLayoutStore>(this.storage.ircLayoutSectionsFilePath, { ircLayoutSections: [] });
		const ircLayoutSections = { ...loadedIrcLayoutSections };

		this.ircLayoutSections$.next(ircLayoutSections.ircLayoutSections);
	}
}
