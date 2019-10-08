import { Injectable } from '@angular/core';
import { CacheBeatmap } from '../models/cache-beatmap';
import { CacheUser } from '../models/cache-user';
import { CacheModifier } from '../models/cache-modifier';
import { StoreService } from './store.service';

@Injectable({
  	providedIn: 'root'
})

export class CacheService {
	private cachedBeatmaps: CacheBeatmap[] = []
	private cachedUsers: CacheUser[] = [];
	private cachedModifiers: CacheModifier[] = [];

  	constructor(private storeService: StoreService) { 
		const beatmapCache = storeService.get('cache.beatmaps');
		const userCache = storeService.get('cache.users');
		const modifierCache = storeService.get('cache.modifiers');

		for(let beatmap in beatmapCache) {
			this.cachedBeatmaps.push(new CacheBeatmap(beatmapCache[beatmap].name, parseInt(beatmap), parseInt(beatmapCache[beatmap].beatmapset_id)));
		}

		for(let user in userCache) {
			this.cachedUsers.push(new CacheUser(parseInt(user), userCache[user]));
		}

		for(let modifier in modifierCache) {
			this.cachedModifiers.push(new CacheModifier(modifierCache[modifier].beatmap_name, parseInt(modifier), modifierCache[modifier].modifier));
		}
	}

	/**
	 * Check if the given userId is cached
	 * @param userId the userId to look for
	 * @returns returns CacheUser if found, null if not
	 */
	public getCachedUser(userId: number): CacheUser {
		let cachedUser: CacheUser = null;

		for(let user in this.cachedUsers) {
			if(this.cachedUsers[user].user_id == userId) {
				cachedUser = this.cachedUsers[user];
				break;
			}
		}

		return (cachedUser !== null) ? cachedUser : null;
	}

	/**
	 * Create or update the cache for the given user
	 * @param cachedUser the CacheUser to create/update
	 */
	public cacheUser(cachedUser: CacheUser): void {
		let cachedUserIndex: number = null;

		// Find the index of the cached user
		for(let user in this.cachedUsers) {
			if(this.cachedUsers[user].user_id == cachedUser.user_id) {
				cachedUserIndex = parseInt(user);
				break;
			}
		}

		// Update or insert the cached user
		if(cachedUserIndex == null) {
			this.cachedUsers.push(cachedUser);
		}
		else {
			this.cachedUsers[cachedUserIndex] = cachedUser;
		}

		// Save it in the store
		this.storeService.set(`cache.users.${cachedUser.user_id}`, cachedUser.username);
	}
}
