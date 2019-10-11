import { Injectable } from '@angular/core';
import { ModBracket } from '../models/osu-mappool/mod-bracket';
import { Mappool } from '../models/osu-mappool/mappool';
import { StoreService } from './store.service';
import { ModBracketMap } from '../models/osu-mappool/mod-bracket-map';

@Injectable({
  	providedIn: 'root'
})

export class MappoolService {
	creationMappool: Mappool;

	allMappools: Mappool[] = [];
	availableMappoolId: number = 0;

  	constructor(private storeService: StoreService) {
		this.creationMappool = new Mappool();

		const storeAllMappools = storeService.get('cache.mappool');

		// Loop through all the mappools
		for(let mappool in storeAllMappools) {
			const 	thisMappool = storeAllMappools[mappool], 
					newMappool = new Mappool();

			newMappool.id = thisMappool.id
			newMappool.name = thisMappool.name;

			// Loop through all the brackets in the current mappool
			for(let bracket in thisMappool.brackets) {
				const 	thisBracket = thisMappool.brackets[bracket],
						newBracket = new ModBracket();

				newBracket.id = thisBracket.id;
				newBracket.mods = thisBracket.mods;
				newBracket.bracketName = thisBracket.bracketName;

				// Loop through all the beatmaps in the current bracket
				for(let beatmap in thisBracket.beatmaps) {
					const newBeatmap = new ModBracketMap();

					newBeatmap.beatmapId = thisBracket.beatmaps[beatmap];
					newBeatmap.beatmapName = thisMappool.modifiers[newBeatmap.beatmapId].beatmapName;
					newBeatmap.beatmapUrl = thisMappool.modifiers[newBeatmap.beatmapId].beatmapUrl;
					newBeatmap.modifier = thisMappool.modifiers[newBeatmap.beatmapId].modifier;
					newBeatmap.invalid = false;

					newBracket.addBeatmap(newBeatmap);

					newMappool.modifiers[newBeatmap.beatmapId] = newBeatmap;
				}

				newMappool.addBracket(newBracket);
			}

			this.availableMappoolId = newMappool.id + 1;
			this.allMappools.push(newMappool);
		}
	}

	/**
	 * Save the mappool in the store and add it to the service
	 * @param mappool the mappool to save
	 */
	public saveMappool(mappool: Mappool): void {
		this.allMappools.push(mappool);
		this.storeService.set(`cache.mappool.${mappool.id}`, mappool.convertToJson());
	}
}
