import { MultiplayerLobbyPlayersPlayer } from "./multiplayer-lobby-players-player";

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
	movePlayerToSlot(player: { slotId: number, username: string }) {
		let movePlayer: MultiplayerLobbyPlayersPlayer;

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == player.username) {
				const existingPlayer = MultiplayerLobbyPlayersPlayer.makeTrueCopy(this.players[i]);
				existingPlayer.slot = player.slotId;

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
	changeHost(hostChanged: { newHost: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == hostChanged.newHost) {
				this.players[i].isHost = true;
			}

			if (this.players[i].isHost == true && this.players[i].username != hostChanged.newHost) {
				this.players[i].isHost = false;
			}
		}
	}

	/**
	 * Gets called when a player changes team. See Regex.playerHasChangedTeam
	 * @param playerHasChangedTeam
	 */
	playerChangedTeam(playerHasChangedTeam: { username: string, team: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == playerHasChangedTeam.username) {
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
	playerLeft(playerLeft: { username: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].username == playerLeft.username) {
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
	playerJoined(playerJoined: { username: string, slot: number, team: string }) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].slot == playerJoined.slot) {
				const newPlayer = new MultiplayerLobbyPlayersPlayer();

				newPlayer.username = playerJoined.username;
				newPlayer.slot = playerJoined.slot;
				newPlayer.team = playerJoined.team;

				this.players[i] = newPlayer;
			}
		}
	}
}
