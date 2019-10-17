import { Injectable } from '@angular/core';
import { Mappool } from '../models/osu-mappool/mappool';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})

export class MappoolService {
	private readonly firebaseUrl: string = "https://axs-calculator-2f0ab.firebaseio.com/mappool.json";
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
			this.allMappools.push(newMappool);
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
	 * Delete the mappool in the store and service
	 * @param mappool the mappool to delete
	 */
	public deleteMappool(mappool: Mappool): void {
		this.allMappools.splice(this.allMappools.indexOf(mappool), 1);
		this.storeService.delete(`cache.mappool.${mappool.id}`);
	}

	/**
	 * Publish a mappool to firebase
	 * @param mappool the mappool to publish
	 */
	public publishMappool(mappool: Mappool) {
		firebase.database().ref(`mappool/${mappool.publish_id}`).set(mappool.convertToJson());
	}

	/**
	 * Get a published mappool by the published_id
	 * @param publish_id the id of the mappool that was published
	 */
	public getPublishedMappool(publish_id: string): Observable<Mappool> {
		return this.httpClient.get<Mappool>(this.firebaseUrl).pipe(
			map((data: any) => {
				if(data.hasOwnProperty(publish_id)) {
					return Mappool.serializeJson(data[publish_id]) 
				}
				
				return undefined;
			})
		);
	}
}
