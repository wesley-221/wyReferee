import { MultiplayerLobbyPlayersPlayer } from './multiplayer-lobby-players-player';
import { BanchoLobbyPlayer } from 'bancho.js';
import { OsuHelper } from '../osu-models/osu';

export class MultiplayerLobbyPlayers {
	players: MultiplayerLobbyPlayersPlayer[];

	constructor() {
		this.players = [];

		for (let i = 1; i <= 16; i++) {
			const newPlayer = new MultiplayerLobbyPlayersPlayer();
			newPlayer.slot = i;
			this.players.push(newPlayer);
		}
	}

	/**
	 * Gets called when a player joins
	 *
	 * @param player the player that joined
	 * @param slot the slot the player joined in
	 * @param team the team the player joined as
	 */
	playerJoined(player: BanchoLobbyPlayer, slot: number, team: string) {
		for (const mpSlot of this.players) {
			if (mpSlot.slot == slot) {
				mpSlot.username = player.user.username;
				mpSlot.team = team;

				break;
			}
		}

		return this.players;
	}

	/**
	 * Gets called when a player leaves the match (kick or normal leave)
	 *
	 * @param player the player that left the lobby
	 */
	playerLeft(player: BanchoLobbyPlayer) {
		for (const mpSlot of this.players) {
			if (mpSlot.username == player.user.username) {
				mpSlot.username = 'Open';
				mpSlot.team = 'invalid';
				mpSlot.mods = [];

				break;
			}
		}

		return this.players;
	}

	/**
	 * Gets called when a player moves around in a multiplayer lobby
	 *
	 * @param player the player that moved
	 * @param slot the slot the player moved to
	 */
	movePlayerToSlot(player: BanchoLobbyPlayer, slot: number) {
		for (const mpSlot of this.players) {
			if (mpSlot.username == player.user.username) {
				mpSlot.username = 'Open';
				mpSlot.team = 'invalid';
				mpSlot.mods = [];

				break;
			}
		}

		for (const mpSlot of this.players) {
			if (mpSlot.slot == slot) {
				mpSlot.username = player.user.username;
				mpSlot.team = player.team;

				for (const mod of player.mods) {
					mpSlot.mods.push(OsuHelper.getModAbbreviation(mod.longMod));
				}

				break;
			}
		}

		return this.players;
	}

	/**
	 * Gets called when the host changes
	 *
	 * @param player the player that is the new host
	 */
	changeHost(player: BanchoLobbyPlayer) {
		for (const mpSlot of this.players) {
			if (mpSlot.username == player.user.username) {
				mpSlot.isHost = true;
			}
			else {
				mpSlot.isHost = false;
			}
		}

		return this.players;
	}

	/**
	 * Gets called when the match host gets cleared
	 */
	clearMatchHost() {
		for (const mpSlot of this.players) {
			mpSlot.isHost = false;
		}

		return this.players;
	}

	/**
	 * Gets called when a player changes team. See Regex.playerHasChangedTeam
	 *
	 * @param player the player that changed team
	 * @param team the team of the player changed to
	 */
	playerChangedTeam(player: BanchoLobbyPlayer, team: string) {
		for (const mpSlot of this.players) {
			if (mpSlot.username == player.user.username) {
				mpSlot.team = team;

				break;
			}
		}

		return this.players;
	}

	/**
	 * Gets called when !mp settings is ran, see Regex.playerInSlot
	 *
	 * @param playerInSlot
	 */
	playerChanged(playerInSlot: { type: string; slotId: number; status: string; username: string; host: boolean; team: string; mods: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == playerInSlot.username) {
				const newPlayer = new MultiplayerLobbyPlayersPlayer();
				newPlayer.slot = this.players[i].slot;

				this.players[i] = newPlayer;
			}

			if (this.players[i].slot == playerInSlot.slotId) {
				const newPlayer = new MultiplayerLobbyPlayersPlayer();
				newPlayer.slot = playerInSlot.slotId;
				newPlayer.username = playerInSlot.username;
				newPlayer.team = playerInSlot.team;
				newPlayer.status = playerInSlot.status.trim();
				newPlayer.isHost = playerInSlot.host;

				const mods = playerInSlot.mods.split(',');

				for (const mod of mods) {
					newPlayer.mods.push(OsuHelper.getModAbbreviation(mod));
				}

				this.players[i] = newPlayer;
			}
		}

		return this.players;
	}

	/**
	 * Get a player by the username
	 * @param username the username of the user to get
	 * @returns
	 */
	getPlayerByUsername(username: string) {
		for (const user of this.players) {
			if (user.username == username) {
				return user;
			}
		}

		return null;
	}
}
