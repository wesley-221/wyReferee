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

	async get(key: keyof CacheStore, mapKey: string | number) {
		const current = this.cacheStore$.value;

		if (!current) throw new Error('Cache store not loaded yet');

		return current[key][mapKey];
	}

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

	watchCache() {
		return this.cacheStore$.asObservable();
	}

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
