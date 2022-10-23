import { Injectable } from '@angular/core';
import { Lobby } from 'app/models/lobby';
import { MultiplayerLobbyPlayers } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MultiplayerLobbyPlayersService {
	multiplayerLobbyChanged$: BehaviorSubject<{ lobbyId: number; action: string; data: any }>;

	multiplayerLobbies: any;

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
		let foundTeam: WyTeam = null;
		let foundUser: WyTeamPlayer = null;
		const multiplayerLobbyPlayers: MultiplayerLobbyPlayers = this.multiplayerLobbies[lobby.lobbyId].players;

		if (!lobby.tournament.isSoloTournament()) {
			for (const team of lobby.tournament.teams) {
				if (lobby.teamOneName == team.name) {
					foundTeam = team;

					for (const player of team.players) {
						if (player.name == username) {
							foundUser = player;
							break;
						}
					}

					if (foundUser != null) {
						break;
					}
				}
			}
		}

		for (const player of multiplayerLobbyPlayers.players) {
			// Solo tournament
			if (lobby.tournament.isSoloTournament()) {
				if (player.username == username) {
					if (lobby.teamOneName == username) {
						if (player.slot == 1) {
							return true;
						}
					}
					else if (lobby.teamTwoName == username) {
						if (player.slot == 2) {
							return true;
						}
					}

					break;
				}
			}
			// Team tournament
			else {
				if (foundUser != null && foundTeam != null) {
					if (lobby.teamOneName == foundTeam.name) {
						if (player.username == foundUser.name) {
							if (lobby.teamOneSlotArray.indexOf(player.slot - 1) > -1) {
								return true;
							}
						}
					}
					else if (lobby.teamTwoName == foundTeam.name) {
						if (player.username == foundUser.name) {
							if (lobby.teamTwoSlotArray.indexOf(player.slot - 1) > -1) {
								return true;
							}
						}
					}
				}
			}
		}

		return false;
	}
}
