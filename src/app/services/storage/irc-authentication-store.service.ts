import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { BehaviorSubject } from 'rxjs';

interface IrcAuthenticationStore {
	apiKey: string;
	ircUsername: string;
	ircPassword: string;
}

@Injectable({
	providedIn: 'root'
})
export class IrcAuthenticationStoreService {
	private ircAuthenticationStorePath = this.storage.joinPath(this.storage.mainDataPath, 'irc-authentication-store.json');
	private ircAuthenticationStore$ = new BehaviorSubject<IrcAuthenticationStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadOsuIrcStore();
	}

	/**
	 * Retrieves the value of a specific key from the irc authentication store
	 *
	 * @param key key to retrieve
	 */
	get(key: keyof IrcAuthenticationStore) {
		const current = this.ircAuthenticationStore$.value;

		if (!current) throw new Error('Irc authentication store not loaded yet');

		return current[key];
	}

	/**
	 * Sets the value of a specific key in the irc authentication store
	 *
	 * @param key key of the setting to update
	 * @param value new value for the setting
	 */
	set(key: keyof IrcAuthenticationStore, value: string): void {
		const current = this.ircAuthenticationStore$.value;

		if (!current) throw new Error('Irc authentication store not loaded yet');

		const newStore: IrcAuthenticationStore = { ...current, [key]: value };
		this.ircAuthenticationStore$.next(newStore);
		this.storage.writeJSON(this.ircAuthenticationStorePath, newStore);
	}

	/**
	 * Removes a key or multiple keys from the irc authentication store
	 *
	 * @param keys key or array of keys to remove from the irc authentication store
	 */
	remove(keys: keyof IrcAuthenticationStore | Array<keyof IrcAuthenticationStore>): void {
		const current = this.ircAuthenticationStore$.value;

		if (!current) throw new Error('Irc authentication store not loaded yet');

		const newStore: IrcAuthenticationStore = { ...current };
		const keysToRemove = Array.isArray(keys) ? keys : [keys];

		for (const key of keysToRemove) {
			delete newStore[key];
		}

		this.ircAuthenticationStore$.next(newStore);
		this.storage.writeJSON(this.ircAuthenticationStorePath, newStore);
	}

	/**
	 * Return an observable that emits the current irc authentication store
	 */
	watchIrcStore() {
		return this.ircAuthenticationStore$.asObservable();
	}

	/**
	 * Loads the irc authentication store from storage and initializes the BehaviorSubject
	 */
	private async loadOsuIrcStore() {
		const osuIrcStore = await this.storage.readJSON<IrcAuthenticationStore>(this.ircAuthenticationStorePath, {});

		this.ircAuthenticationStore$.next(osuIrcStore);
	}
}
