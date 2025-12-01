import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { CacheBeatmap } from 'app/models/cache/cache-beatmap';
import { CacheUser } from 'app/models/cache/cache-user';
import { BehaviorSubject } from 'rxjs';

interface CacheStore {
	beatmaps: {
		[beatmapId: number]: CacheBeatmap;
	};

	users: {
		[userId: number]: CacheUser;
	};
}

@Injectable({
	providedIn: 'root'
})
export class CacheStoreService {
	private cacheStore$ = new BehaviorSubject<CacheStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadCache();
	}

	/**
	 * Retrieves the value of a specific item in the cache store
	 *
	 * @param key key of the cache (beatmaps or users)
	 * @param mapKey key of the specific item in the cache
	 */
	async get(key: keyof CacheStore, mapKey: string | number) {
		const current = this.cacheStore$.value;

		if (!current) throw new Error('Cache store not loaded yet');

		return current[key][mapKey];
	}

	/**
	 * Sets a value in the cache store
	 *
	 * @param key key of the cache (beatmaps or users)
	 * @param mapKey key of the specific item in the cache
	 * @param value value to set in the cache
	 */
	async set(key: keyof CacheStore, mapKey: string | number, value: CacheBeatmap | CacheUser) {
		const current = this.cacheStore$.value;

		if (!current) throw new Error('Cache store not loaded yet');

		const updatedSection = {
			...current[key],
			[mapKey]: value
		};

		const newStore = { ...current, [key]: updatedSection };
		this.cacheStore$.next(newStore);

		const filePath = await this.storage.joinPath(this.storage.cachePath, `cache-${key}.json`);
		await this.storage.writeJSON(filePath, newStore[key]);
	}

	/**
	 * Resets the cache for a specific key
	 *
	 * @param key key of the cache (beatmap or users)
	 */
	async resetCache(key: keyof CacheStore) {
		const current = this.cacheStore$.value;

		if (!current) throw new Error('Cache store not loaded yet');

		const filePath = await this.storage.joinPath(this.storage.cachePath, `cache-${key}.json`);
		await this.storage.writeJSON(filePath, {});
	}

	/**
	 * Returns an observable that emits the cache
	 */
	watchCache() {
		return this.cacheStore$.asObservable();
	}

	/**
	 * Loads all cache data from storage and initializes the BehaviorSubject
	 */
	private async loadCache() {
		const usersFilePath = await this.storage.joinPath(this.storage.cachePath, 'cache-users.json');
		const beatmapsFilePath = await this.storage.joinPath(this.storage.cachePath, 'cache-beatmaps.json');

		const users = await this.storage.readJSON<{ [userId: number]: CacheUser }>(usersFilePath, {});
		const beatmaps = await this.storage.readJSON<{ [beatmapId: number]: CacheBeatmap }>(beatmapsFilePath, {});

		this.cacheStore$.next({
			beatmaps,
			users
		});
	}
}
