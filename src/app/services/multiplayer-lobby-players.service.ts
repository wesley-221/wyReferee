import { Injectable } from '@angular/core';
import { Lobby } from 'app/models/lobby';
import { MultiplayerLobbyPlayers } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MultiplayerLobbyPlayersService {
	multiplayerLobbyChanged$: BehaviorSubject<{ lobbyId: number; action: string; data: any }>;

	multiplayerLobbies: { [lobbyId: number]: { players: MultiplayerLobbyPlayers } };

	constructor() {
		this.multiplayerLobbyChanged$ = new BehaviorSubject(null);
		this.multiplayerLobbies = {};

		this.multiplayerLobbyChanged$.subscribe(changed => {
			if (changed == null) {
				return;
			}

			const data = changed.data;
			const multiplayerLobby: MultiplayerLobbyPlayers = this.multiplayerLobbies[changed.lobbyId].players;

			if (changed.action == 'playerJoined') {
				multiplayerLobby.playerJoined(data.player, (data.slot + 1), data.team);
			}
			else if (changed.action == 'playerLeft') {
				multiplayerLobby.playerLeft(data);
			}
			else if (changed.action == 'playerMoved') {
				multiplayerLobby.movePlayerToSlot(data.player, (data.slot + 1));
			}
			else if (changed.action == 'host') {
				// Somehow gets triggered by hostCleared as well sometimes
				// Add null check for when that happens
				if (data != null) {
					multiplayerLobby.changeHost(data);
				}
			}
			else if (changed.action == 'hostCleared') {
				multiplayerLobby.clearMatchHost();
			}
			else if (changed.action == 'playerChangedTeam') {
				multiplayerLobby.playerChangedTeam(data.player, data.team);
			}
			else if (changed.action == 'playerInSlot') {
				multiplayerLobby.playerChanged(data);
			}
		});
	}

	/**
	 * Create a new multiplayer lobby players object
	 *
	 * @param lobbyId the id of the lobby
	 */
	createNewMultiplayerLobbyObject(lobbyId: number): void {
		this.multiplayerLobbies[lobbyId] = {
			players: new MultiplayerLobbyPlayers()
		};
	}

	/**
	 * Change the lobby data
	 *
	 * @param lobbyId the id of the lobby a player was changed in
	 * @param action the type of change
	 * @param data the new data
	 */
	lobbyChange(lobbyId: number, action: string, data: any): void {
		this.multiplayerLobbyChanged$.next({ lobbyId: lobbyId, action: action, data: data });
	}

	/**
	 * Check if the user is in the correct slot of the multiplayer lobby
	 *
	 * @param username the user to check if they are in the correct slot
	 */
	isInCorrectSlot(username: string, lobby: Lobby): boolean {
		if (username == 'Open') {
			return true;
		}

		const multiplayerPlayer = this.multiplayerLobbies[lobby.lobbyId]
			.players
			.getPlayers()
			.find(player => player.username === username);

		// User not found, ignore
		if (!multiplayerPlayer) {
			return false;
		}

		// Solo tournament, check if the user is in the correct slot for their team
		if (lobby.tournament.isSoloTournament()) {
			if (lobby.teamOneName === username) {
				return multiplayerPlayer.slot === 1;
			}

			if (lobby.teamTwoName === username) {
				return multiplayerPlayer.slot === 2;
			}

			return false;
		}

		// Team tournament, find the user's team and check if they are in the correct slot for their team
		const result = lobby.tournament.teams
			.flatMap(team =>
				team.players.map(player => ({
					team,
					player
				}))
			)
			.find(entry => entry.player.name === username);

		if (!result) {
			return false;
		}

		const { team, player } = result;

		if (multiplayerPlayer.username !== player.name) {
			return false;
		}

		if (lobby.teamOneName === team.name) {
			return lobby.teamOneSlotArray.includes(multiplayerPlayer.slot - 1);
		}

		if (lobby.teamTwoName === team.name) {
			return lobby.teamTwoSlotArray.includes(multiplayerPlayer.slot - 1);
		}

		return false;
	}
}
