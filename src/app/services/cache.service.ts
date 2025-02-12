import { Injectable } from '@angular/core';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { CacheUser } from '../models/cache/cache-user';
import { CacheModifier } from '../models/cache/cache-modifier';
import { StoreService } from './store.service';

@Injectable({
	providedIn: 'root'
})

export class CacheService {
	cacheVersion: string;

	private cachedBeatmaps: CacheBeatmap[] = [];
	private cachedUsers: CacheUser[] = [];
	private cachedModifiers: CacheModifier[] = [];

	constructor(private storeService: StoreService) {
		const beatmapCache = storeService.get('cache.beatmaps');
		const userCache = storeService.get('cache.users');
		const modifierCache = storeService.get('cache.modifiers');

		this.cacheVersion = storeService.get('cache-version');

		for (const beatmap in beatmapCache) {
			this.cachedBeatmaps.push(new CacheBeatmap({
				name: beatmapCache[beatmap].name,
				beatmapId: parseInt(beatmap),
				beatmapSetId: parseInt(beatmapCache[beatmap].beatmapset_id),
				beatmapUrl: `https://osu.ppy.sh/beatmaps/${beatmapCache[beatmap].beatmapset_id as string}`
			}));
		}

		for (const user in userCache) {
			this.cachedUsers.push(new CacheUser({
				user_id: parseInt(user),
				username: userCache[user]
			}));
		}

		for (const modifier in modifierCache) {
			this.cachedModifiers.push(new CacheModifier(modifierCache[modifier].beatmap_name, parseInt(modifier), modifierCache[modifier].modifier));
		}
	}

	/**
	 * Check if the given beatmapId is cached
	 *
	 * @param beatmapId the beatmapId to look for
	 * @returns returns CacheBeatmap if found, null if not
	 */
	public getCachedBeatmap(beatmapId: number): CacheBeatmap {
		let cachedBeatmap: CacheBeatmap = null;

		for (const beatmap in this.cachedBeatmaps) {
			if (this.cachedBeatmaps[beatmap].beatmapId == beatmapId) {
				cachedBeatmap = this.cachedBeatmaps[beatmap];
				break;
			}
		}

		return (cachedBeatmap !== null) ? cachedBeatmap : null;
	}

	/**
	 * Check if the given beatmapId is cached in a mappool
	 *
	 * @param beatmapId the beatmapId to look for
	 */
	public getCachedBeatmapFromMappools(beatmapId: number): CacheBeatmap {
		const mappools = this.storeService.get('cache.mappool');

		for (const mappool in mappools) {
			for (const modBracket in mappools[mappool].modBrackets) {
				for (const beatmap in mappools[mappool].modBrackets[modBracket].beatmaps) {
					if (mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapId == beatmapId) {
						return new CacheBeatmap({
							name: mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapName,
							beatmapId: mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapId,
							beatmapSetId: mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapsetId,
							beatmapUrl: mappools[mappool].modBrackets[modBracket].beatmaps[beatmap].beatmapUrl
						});
					}
				}
			}
		}

		return null;
	}

	/**
	 * Create or update the cache for the given beatmap
	 *
	 * @param cachedBeatmap the CacheBeatmap to create/update
	 */
	public cacheBeatmap(cachedBeatmap: CacheBeatmap): void {
		let cachedBeatmapIndex: number = null;

		// Find the index of the cached user
		for (const beatmap in this.cachedBeatmaps) {
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
	 *
	 * @param userId the userId to look for
	 * @returns returns CacheUser if found, null if not
	 */
	public getCachedUser(userId: number): CacheUser {
		let cachedUser: CacheUser = null;

		for (const user in this.cachedUsers) {
			if (this.cachedUsers[user].user_id == userId) {
				cachedUser = this.cachedUsers[user];
				break;
			}
		}

		return (cachedUser !== null) ? cachedUser : null;
	}

	/**
	 * Create or update the cache for the given user
	 *
	 * @param cachedUser the CacheUser to create/update
	 */
	public cacheUser(cachedUser: CacheUser): void {
		let cachedUserIndex: number = null;

		// Find the index of the cached user
		for (const user in this.cachedUsers) {
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

	/**
	 * Clear all cache
	 */
	public clearAllData(): void {
		this.storeService.delete('irc.channels');
		this.storeService.delete('lobby');
		this.storeService.delete('cache');
	}

	/**
	 * Set the version of the cache
	 *
	 * @param version the new version
	 */
	public setCacheVersion(version: string): void {
		this.storeService.set('cache-version', version);
	}

	/**
	 * Set the version of wyReferee
	 *
	 * @param version the version to set
	 */
	public setVersion(version: string): void {
		this.storeService.set('version', version);
	}

	/**
	 * Get the version of wyReferee
	 */
	public getVersion(): string {
		return this.storeService.get('version');
	}

	/**
	 * Get the cover image
	 *
	 * @param beatmapId the beatmapid
	 */
	getBeatmapCoverUrl(beatmapId: number): string {
		const cachedBeatmap = this.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? `https://assets.ppy.sh/beatmaps/${cachedBeatmap.beatmapSetId}/covers/cover.jpg` : '';
	}

	/**
	 * Get the cached beatmap if it exists
	 *
	 * @param beatmapId the beatmapid
	 */
	getBeatmapname(beatmapId: number) {
		const cachedBeatmap = this.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap.name : 'Unknown beatmap, synchronize the lobby to get the map name.';
	}
}
