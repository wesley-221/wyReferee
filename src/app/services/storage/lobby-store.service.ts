import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { Lobby } from 'app/models/lobby';
import { BehaviorSubject } from 'rxjs';

interface LobbyStore {
	[lobbyName: string]: Lobby;
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
	async saveLobby(lobby: Lobby) {
		const current = this.lobbies$.value;

		if (!current) throw new Error('Lobby store not initialized');

		const newLobbies = { ...current, [lobby.getFileName()]: lobby };
		this.lobbies$.next(newLobbies);

		const filePath = await this.storage.joinPath(this.storage.lobbyPath, `${lobby.getFileName()}.json`);
		this.storage.writeJSON(filePath, lobby);
	}

	/**
	 * Deletes a lobby
	 * @param lobby the lobby to delete
	 */
	async deleteLobby(lobby: Lobby) {
		const current = this.lobbies$.value;

		if (!current) throw new Error('Lobby store not initialized');

		const { [lobby.getFileName()]: _, ...newLobbies } = current;
		this.lobbies$.next(newLobbies);

		const filePath = await this.storage.joinPath(this.storage.lobbyPath, `${lobby.getFileName()}.json`);
		this.storage.deleteFile(filePath);
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
				const filePath = await this.storage.joinPath(this.storage.lobbyPath, file);
				const lobby = await this.storage.readJSON<Lobby>(filePath);

				if (lobby) {
					const lobbyObject = Lobby.makeTrueCopy(lobby);
					lobbies[lobbyObject.getFileName()] = lobbyObject;
				}
			}
		}

		this.lobbies$.next(lobbies);
	}
}
