import { Injectable } from '@angular/core';
import { Mappool } from '../models/osu-mappool/mappool';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModBracket } from '../models/osu-mappool/mod-bracket';
import { ModBracketMap } from '../models/osu-mappool/mod-bracket-map';
import { AppConfig } from '../../environments/environment';
import { Misc } from '../models/misc';
import { LoggedInUser } from '../models/authentication/logged-in-user';

@Injectable({
  	providedIn: 'root'
})

export class MappoolService {
	private readonly apiUrl = AppConfig.apiUrl;
	creationMappool: Mappool;

	allMappools: Mappool[] = [];
	availableMappoolId: number = 0;

  	constructor(private storeService: StoreService, private httpClient: HttpClient) {
		this.creationMappool = new Mappool();

		const storeAllMappools = storeService.get('cache.mappool');

		// Loop through all the mappools
		for(let mappool in storeAllMappools) {
			const 	thisMappool = storeAllMappools[mappool],
					newMappool = Mappool.serializeJson(thisMappool);

			this.availableMappoolId = newMappool.id + 1;

			// Check for updates
			if(newMappool.publishId != undefined) {
				this.getPublishedMappool(newMappool.publishId).subscribe((data) => {
					const updatedMappool: Mappool = this.mapFromJson(data);
					newMappool.updateAvailable = !Misc.deepEquals(updatedMappool, newMappool);

					this.allMappools.push(newMappool);
				}, (err) => {
					this.allMappools.push(newMappool);
				});
			}
			else {
				this.allMappools.push(newMappool);
			}
		}
	}

	/**
	 * Get the mappool of the given id
	 * @param mappoolId the id of the mappool
	 */
	public getMappool(mappoolId: number): Mappool {
		let returnMappool: Mappool = null;

		for(let i in this.allMappools) {
			if(this.allMappools[i].id == mappoolId) {
				returnMappool = this.allMappools[i];
				break;
			}
		}

		return returnMappool;
	}

	/**
	 * Save the mappool in the store and add it to the service
	 * @param mappool the mappool to save
	 */
	public saveMappool(mappool: Mappool): void {
		this.allMappools.push(mappool);
		this.storeService.set(`cache.mappool.${mappool.id}`, mappool.convertToJson());
	}

	/**
	 * Update the mappool with the given id
	 * @param mappool the mappool to update
	 */
	public updateMappool(mappool: Mappool): void {
		for(let i in this.allMappools) {
			if(this.allMappools[i].id == mappool.id) {
				this.allMappools[i] = mappool;

				this.storeService.set(`cache.mappool.${mappool.id}`, mappool.convertToJson());
				return;
			}
		}
	}

	/**
	 * Update a published mappool
	 * @param mappool the mappool to update
	 */
	public updatePublishedMappool(mappool: Mappool) {
		return this.httpClient.post<Mappool>(`${this.apiUrl}mappool/update`, mappool, { observe: "response" });
	}

	/**
	 * Replace the original mappool with the new mappool
	 * @param originalMappool the mappool to replace
	 * @param updatedMappool the mappool with the new values
	 */
	public replaceMappool(originalMappool: Mappool, updatedMappool: Mappool) {
		for(let i in this.allMappools) {
			if(this.allMappools[i].id == originalMappool.id) {
				updatedMappool.id = originalMappool.id;
				this.allMappools[i] = updatedMappool;

				this.storeService.set(`cache.mappool.${originalMappool.id}`, updatedMappool.convertToJson());
				return;
			}
		}
	}

	/**
	 * Delete the mappool in the store and service
	 * @param mappool the mappool to delete
	 */
	public deleteMappool(mappool: Mappool): void {
		this.allMappools.splice(this.allMappools.indexOf(mappool), 1);
		this.storeService.delete(`cache.mappool.${mappool.id}`);
	}

	/**
	 * Publish a mappool
	 * @param mappool the mappool to publish
	 */
	public publishMappool(mappool: Mappool): Observable<any> {
		return this.httpClient.post<Mappool>(`${this.apiUrl}mappool/create`, mappool, { observe : "response" });
	}

	/**
	 * Get a published mappool by mappool id
	 * @param mappool_id the id of the mappool that was published
	 */
	public getPublishedMappool(mappool_id: number): Observable<Mappool> {
		return this.httpClient.get<Mappool>(`${this.apiUrl}mappool/get/${mappool_id}`);
	}

	/**
	 * Get all the published mappools from the given user
	 * @param user the user to get all the mappools from
	 */
	public getAllPublishedMappoolsFromUser(user: LoggedInUser) {
		return this.httpClient.get<Mappool[]>(`${this.apiUrl}mappool/created_by/${user.userId}`);
	}

	/**
	 * Delete a mappool
	 * @param mappool the mappool to delete
	 */
	public deletePublishedMappool(mappool: Mappool) {
		return this.httpClient.delete<Mappool>(`${this.apiUrl}mappool/${mappool.id}`);
	}

	/**
	 * Map back-end mappool to front-end
	 * @param json
	 */
	public mapFromJson(json: Mappool): Mappool {
		const newMappool: Mappool = new Mappool();

		newMappool.id = json.id;
		newMappool.name = json.name;
		newMappool.gamemodeId = json.gamemodeId;
		newMappool.publishId = json.id;

		for(let modBracket in json.modBrackets) {
			const 	newBracket: ModBracket = new ModBracket(),
					iterationBracket = json.modBrackets[modBracket];

			// Reset the bracket id
			newBracket.id = iterationBracket.id;
			newBracket.mods = iterationBracket.mods;
			newBracket.bracketName = iterationBracket.bracketName;

			for(let beatmap in iterationBracket.beatmaps) {
				const 	newBeatmap: ModBracketMap = new ModBracketMap(),
						iterationMap: ModBracketMap = iterationBracket.beatmaps[beatmap];

				newBeatmap.id = iterationMap.id;
				newBeatmap.beatmapId = iterationMap.beatmapId;
				newBeatmap.beatmapName = iterationMap.beatmapName;
				newBeatmap.beatmapUrl = iterationMap.beatmapUrl;
				newBeatmap.gamemodeId = iterationMap.gamemodeId;
				newBeatmap.modifier = iterationMap.modifier;

				newMappool.modifiers[newBeatmap.beatmapId] = newBeatmap;

				newMappool.allBeatmaps.push({
					beatmapId: newBeatmap.beatmapId,
					mod: newBracket.mods,
					name: newBeatmap.beatmapName
				})

				newBracket.addBeatmap(newBeatmap);
			}

			newMappool.addBracket(newBracket);
		}

		return newMappool;
	}
}
