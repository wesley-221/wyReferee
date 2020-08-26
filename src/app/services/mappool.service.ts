import { Injectable } from '@angular/core';
import { Mappool } from '../models/osu-mappool/mappool';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../environments/environment';
import { LoggedInUser } from '../models/authentication/logged-in-user';
import { ModBracket } from '../models/osu-mappool/mod-bracket';
import { MysteryMappoolHelper } from '../models/osu-mappool/mystery-mappool-helper';
import { MultiplayerLobby } from '../models/store-multiplayer/multiplayer-lobby';

@Injectable({
	providedIn: 'root'
})

export class MappoolService {
	private readonly apiUrl = AppConfig.apiUrl;
	creationMappool: Mappool;

	allMappools: Mappool[] = [];
	availableMappoolId = 0;

	mappoolLoaded$: BehaviorSubject<boolean>;

	constructor(private storeService: StoreService, private httpClient: HttpClient) {
		this.mappoolLoaded$ = new BehaviorSubject<boolean>(false);
		this.creationMappool = new Mappool();

		const storeAllMappools = storeService.get('cache.mappool');

		// Loop through all the mappools
		for (const mappool in storeAllMappools) {
			const thisMappool = storeAllMappools[mappool];
			const newMappool = Mappool.serializeJson(thisMappool);

			this.availableMappoolId = newMappool.id + 1;

			// Check for updates
			if (newMappool.publishId != undefined) {
				this.getPublishedMappool(newMappool.publishId).subscribe((data) => {
					const updatedMappool: Mappool = Mappool.serializeJson(data);
					newMappool.updateAvailable = !newMappool.comapreTo(updatedMappool);

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

		for (const i in this.allMappools) {
			if (this.allMappools[i].id == mappoolId) {
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
		for (const i in this.allMappools) {
			if (this.allMappools[i].id == mappool.id) {
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
		return this.httpClient.post<Mappool>(`${this.apiUrl}mappool`, mappool, { observe: 'response' });
	}

	/**
	 * Replace the original mappool with the new mappool
	 * @param originalMappool the mappool to replace
	 * @param updatedMappool the mappool with the new values
	 */
	public replaceMappool(originalMappool: Mappool, updatedMappool: Mappool) {
		for (const i in this.allMappools) {
			if (this.allMappools[i].id == originalMappool.id) {
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
		return this.httpClient.post<Mappool>(`${this.apiUrl}mappool`, mappool, { observe: 'response' });
	}

	/**
	 * Get a published mappool by mappool id
	 * @param mappool_id the id of the mappool that was published
	 */
	public getPublishedMappool(mappool_id: number): Observable<Mappool> {
		return this.httpClient.get<Mappool>(`${this.apiUrl}mappool/${mappool_id}`);
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
	 * Get a map from the given mystery mappool
	 * @param mappool the mappool to get the mystery map from
	 * @param modBracket the modbracket to get the mystery map from
	 */
	public pickMysteryMap(mappool: Mappool, modBracket: ModBracket, lobby: MultiplayerLobby, refereeName: string) {
		const mysteryMappoolHelper = new MysteryMappoolHelper(mappool.publishId, modBracket.id, lobby, refereeName, lobby.pickedCategories);
		return this.httpClient.post<MysteryMappoolHelper>(`${this.apiUrl}mappool/mystery/get`, mysteryMappoolHelper);
	}
}
