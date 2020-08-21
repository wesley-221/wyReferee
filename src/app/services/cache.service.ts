import { Injectable } from '@angular/core';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { CacheUser } from '../models/cache/cache-user';
import { CacheModifier } from '../models/cache/cache-modifier';
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

		for (let beatmap in beatmapCache) {
			this.cachedBeatmaps.push(new CacheBeatmap(beatmapCache[beatmap].name, parseInt(beatmap), parseInt(beatmapCache[beatmap].beatmapset_id), `https://osu.ppy.sh/beatmaps/${beatmapCache[beatmap].beatmapset_id}`));
		}

		for (let user in userCache) {
			this.cachedUsers.push(new CacheUser(parseInt(user), userCache[user]));
		}

		for (let modifier in modifierCache) {
			this.cachedModifiers.push(new CacheModifier(modifierCache[modifier].beatmap_name, parseInt(modifier), modifierCache[modifier].modifier));
		}
	}

	/**
	 * Check if the given beatmapId is cached
	 * @param beatmapId the beatmapId to look for
	 * @returns returns CacheBeatmap if found, null if not
	 */
	public getCachedBeatmap(beatmapId: number): CacheBeatmap {
		let cachedBeatmap: CacheBeatmap = null;

		for (let beatmap in this.cachedBeatmaps) {
			if (this.cachedBeatmaps[beatmap].beatmapId == beatmapId) {
				cachedBeatmap = this.cachedBeatmaps[beatmap];
				break;
			}
		}

		return (cachedBeatmap !== null) ? cachedBeatmap : null;
	}

	/**
	 * Check if the given beatmapId is cached in a mappool
	 * @param beatmapId the beatmapId to look for
	 */
	public getCachedBeatmapFromMappools(beatmapId: number): CacheBeatmap {
		const mappools = this.storeService.get(`cache.mappool`);

		for (let mappool in mappools) {
			for (let modBracket in mappools[mappool].modBrackets) {
				for (let beatmap in mappools[mappool].modBrackets[modBracket].beatmaps) {
					if (mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapId == beatmapId) {
						return new CacheBeatmap(mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapName, mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapId, mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapsetId, mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapUrl);
					}
				}
			}
		}
	}

	/**
	 * Create or update the cache for the given beatmap
	 * @param cachedBeatmap the CacheBeatmap to create/update
	 */
	public cacheBeatmap(cachedBeatmap: CacheBeatmap): void {
		let cachedBeatmapIndex: number = null;

		// Find the index of the cached user
		for (let beatmap in this.cachedBeatmaps) {
			if (this.cachedBeatmaps[beatmap].beatmapId == cachedBeatmap.beatmapId) {
				cachedBeatmapIndex = parseInt(beatmap);
				break;
			}
		}

		// Update or insert the cached user
		if (cachedBeatmapIndex == null) {
			this.cachedBeatmaps.push(cachedBeatmap);
		}
		else {
			this.cachedBeatmaps[cachedBeatmapIndex] = cachedBeatmap;
		}

		// Save it in the store
		this.storeService.set(`cache.beatmaps.${cachedBeatmap.beatmapId}`, {
			name: cachedBeatmap.name,
			beatmapset_id: cachedBeatmap.beatmapSetId
		});
	}

	/**
	 * Check if the given userId is cached
	 * @param userId the userId to look for
	 * @returns returns CacheUser if found, null if not
	 */
	public getCachedUser(userId: number): CacheUser {
		let cachedUser: CacheUser = null;

		for (let user in this.cachedUsers) {
			if (this.cachedUsers[user].user_id == userId) {
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
		for (let user in this.cachedUsers) {
			if (this.cachedUsers[user].user_id == cachedUser.user_id) {
				cachedUserIndex = parseInt(user);
				break;
			}
		}

		// Update or insert the cached user
		if (cachedUserIndex == null) {
			this.cachedUsers.push(cachedUser);
		}
		else {
			this.cachedUsers[cachedUserIndex] = cachedUser;
		}

		// Save it in the store
		this.storeService.set(`cache.users.${cachedUser.user_id}`, cachedUser.username);
	}
}
