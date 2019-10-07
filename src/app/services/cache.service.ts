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
}
