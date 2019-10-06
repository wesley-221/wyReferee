import { Injectable } from '@angular/core';
import { MultiplayerLobby } from '../models/multiplayer-lobby';
import { StoreService } from './store.service';

@Injectable({
  	providedIn: 'root'
})

export class MultiplayerLobbiesService {
	private allLobbies: MultiplayerLobby[] = [];
	availableLobbyId: number = 0;
	
  	constructor(private storeService: StoreService) {
		const allLobbies = storeService.get('lobby');

		for(let lobby in allLobbies) {
			const currentLobby = allLobbies[lobby];

			const newLobby = new MultiplayerLobby();
			newLobby.loadFromJson(currentLobby);
			this.allLobbies.push(newLobby);

			this.availableLobbyId = newLobby.lobbyId + 1;
		}
	}

	/**
	 * Get all the multiplayer lobbies
	 */
	public getAllLobbies(): MultiplayerLobby[] {
		return this.allLobbies;
	}

	/**
	 * Add a new multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to add
	 */
	public add(multiplayerLobby: MultiplayerLobby): void {
		this.allLobbies.push(multiplayerLobby);
		this.availableLobbyId ++;

		this.storeService.set(`lobby.${multiplayerLobby.lobbyId}`, multiplayerLobby.convertToJson());
	}

	/**
	 * Remove a multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to remove
	 */
	public remove(multiplayerLobby: MultiplayerLobby): void {
		this.allLobbies.splice(this.allLobbies.indexOf(multiplayerLobby), 1);

		this.storeService.delete(`lobby.${multiplayerLobby.lobbyId}`);
	}

	/**
	 * Get a multiplayerlobby
	 * @param lobbyId the id of the multiplayerlobby to get
	 */
	public get(lobbyId: number): MultiplayerLobby {
		for(let lobby in this.allLobbies) {
			if(this.allLobbies[lobby].lobbyId == lobbyId) {
				return this.allLobbies[lobby];
			}
		}

		return null;
	}
}
