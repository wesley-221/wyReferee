import { MultiplayerLobbyPlayersPlayer } from './multiplayer-lobby-players-player';
import { BanchoLobbyPlayer } from 'bancho.js';

export class MultiplayerLobbyPlayers {
	players: MultiplayerLobbyPlayersPlayer[];

	constructor() {
		let counter = 1;

		this.players = [];

		for (let i = 0; i < 16; i++) {
			const newPlayer = new MultiplayerLobbyPlayersPlayer();
			newPlayer.slot = counter;
			this.players.push(newPlayer);

			counter++;
		}
	}

	/**
	 * Gets called when !mp settings is ran, see Regex.playerInSlot
	 * @param playerInSlot
	 */
	playerChanged(playerInSlot: { type: string, slotId: number, status: string, username: string, host: boolean, team: string, mods: string }) {
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
				newPlayer.mods = playerInSlot.mods.split(',');

				this.players[i] = newPlayer;
			}
		}
	}

	/**
	 * Gets called when a player moves around in a multiplayer lobby. See Regex.playerHasMoved
	 * @param player
	 */
	movePlayerToSlot(obj: { player: BanchoLobbyPlayer, slot: number }) {
		let movePlayer: MultiplayerLobbyPlayersPlayer;
		obj.slot = obj.slot + 1;

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == obj.player.user.username) {
				const existingPlayer = MultiplayerLobbyPlayersPlayer.makeTrueCopy(this.players[i]);
				existingPlayer.slot = obj.slot;

				const newPlayer = new MultiplayerLobbyPlayersPlayer();
				newPlayer.slot = this.players[i].slot;

				movePlayer = existingPlayer;
				this.players[i] = newPlayer;
			}
		}

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].slot == movePlayer.slot) {
				this.players[i] = movePlayer;
			}
		}
	}

	/**
	 * Gets called when the host changes. See Regex.hostChanged
	 * @param hostChanged
	 */
	changeHost(player: BanchoLobbyPlayer) {
		if (player == null)
			return;

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == player.user.username) {
				this.players[i].isHost = true;
			}

			if (this.players[i].isHost == true && this.players[i].username != player.user.username) {
				this.players[i].isHost = false;
			}
		}
	}

	/**
	 * Gets called when a player changes team. See Regex.playerHasChangedTeam
	 * @param playerHasChangedTeam
	 */
	playerChangedTeam(playerHasChangedTeam: { player: BanchoLobbyPlayer, team: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == playerHasChangedTeam.player.user.username) {
				this.players[i].team = playerHasChangedTeam.team;
			}
		}
	}

	/**
	 * Gets called when the match host gets cleared. See Regex.clearMatchHost
	 */
	clearMatchHost() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isHost) {
				this.players[i].isHost = false;
			}
		}
	}

	/**
	 * Gets called when a player leaves the match (kick or normal leave). See Regex.playerLeft
	 * @param playerLeft
	 */
	playerLeft(playerLeft: BanchoLobbyPlayer) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == playerLeft.user.username) {
				const newPlayer = new MultiplayerLobbyPlayersPlayer();
				newPlayer.slot = this.players[i].slot;

				this.players[i] = newPlayer;
			}
		}
	}

	/**
	 * Gets called when a player joins. See Regex.playerJoined
	 * @param playerJoined
	 */
	playerJoined(obj: { player: BanchoLobbyPlayer, slot: number, team: string }) {
		obj.slot = obj.slot + 1;

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].slot == obj.slot) {
				const newPlayer = new MultiplayerLobbyPlayersPlayer();

				newPlayer.username = obj.player.user.username;
				newPlayer.slot = obj.slot;
				newPlayer.team = obj.team;

				this.players[i] = newPlayer;
			}
		}
	}
}
