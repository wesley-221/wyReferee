import { Injectable } from '@angular/core';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { CacheUser } from '../models/cache/cache-user';
import { CacheStoreService } from './storage/cache-store.service';
import { filter, take } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class CacheService {
	private cachedBeatmaps: CacheBeatmap[] = [];
	private cachedUsers: CacheUser[] = [];

	constructor(private cacheStore: CacheStoreService) {
		this.cacheStore
			.watchCache()
			.pipe(
				filter(cache => cache !== null),
				take(1)
			)
			.subscribe(cache => {
				if (cache) {
					for (const beatmap in cache.beatmaps) {
						this.cachedBeatmaps.push(new CacheBeatmap({
							name: cache.beatmaps[beatmap].name,
							beatmapId: parseInt(beatmap),
							beatmapSetId: Number(cache.beatmaps[beatmap].beatmapSetId),
							beatmapUrl: `https://osu.ppy.sh/beatmaps/${cache.beatmaps[beatmap].beatmapSetId}`
						}));
					}

					for (const user in cache.users) {
						this.cachedUsers.push(new CacheUser({
							user_id: parseInt(user),
							username: cache.users[user].username
						}));
					}
				}
			});
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
	 * Create or update the cache for the given beatmap
	 *
	 * @param cachedBeatmap the CacheBeatmap to create/update
	 */
	public cacheBeatmap(cachedBeatmap: CacheBeatmap): void {
		if (cachedBeatmap.beatmapId == undefined) return;

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
		this.cacheStore.set('beatmaps', cachedBeatmap.beatmapId, new CacheBeatmap({
			name: cachedBeatmap.name,
			beatmapSetId: cachedBeatmap.beatmapSetId
		}));
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
		this.cacheStore.set('users', cachedUser.user_id, new CacheUser({
			user_id: cachedUser.user_id,
			username: cachedUser.username
		}));
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
