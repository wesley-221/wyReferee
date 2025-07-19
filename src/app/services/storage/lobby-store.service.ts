import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { Lobby } from 'app/models/lobby';
import { BehaviorSubject } from 'rxjs';

interface LobbyStore {
	[lobbyId: number]: Lobby;
}

@Injectable({
	providedIn: 'root'
})
export class LobbyStoreService {
	private lobbies$ = new BehaviorSubject<LobbyStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadLobbies();
	}

	/**
	 * Saves a lobby
	 *
	 * @param lobby the lobby to save
	 */
	saveLobby(lobby: Lobby) {
		const current = this.lobbies$.value;

		if (!current) throw new Error('Lobby store not initialized');

		const newLobbies = { ...current, [lobby.lobbyId]: lobby };
		this.lobbies$.next(newLobbies);

		this.storage.writeJSON(this.storage.joinPath(this.storage.lobbyPath, `${lobby.lobbyId}.json`), lobby);
	}

	/**
	 * Deletes a lobby
	 * @param lobby the lobby to delete
	 */
	deleteLobby(lobby: Lobby) {
		const current = this.lobbies$.value;

		if (!current) throw new Error('Lobby store not initialized');

		const { [lobby.lobbyId]: _, ...newLobbies } = current;
		this.lobbies$.next(newLobbies);

		this.storage.deleteFile(this.storage.joinPath(this.storage.lobbyPath, `${lobby.lobbyId}.json`));
	}

	/**
	 * Returns an observable that emits all lobbies
	 */
	watchLobbies() {
		return this.lobbies$;
	}

	/**
	 * Loads all lobbies from storage and initializes the BehaviorSubject
	 */
	private async loadLobbies() {
		const lobbyFiles = await this.storage.listFiles(this.storage.lobbyPath);

		const lobbies: LobbyStore = {};

		for (const file of lobbyFiles) {
			if (file.endsWith('.json')) {
				const lobbyId = parseInt(file.replace('.json', ''), 10);
				const lobby = await this.storage.readJSON<Lobby>(this.storage.joinPath(this.storage.lobbyPath, file));

				if (lobby) {
					lobbies[lobbyId] = lobby;
				}
			}
		}

		this.lobbies$.next(lobbies);
	}
}
