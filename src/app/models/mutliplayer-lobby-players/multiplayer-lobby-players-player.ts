export class MultiplayerLobbyPlayersPlayer {
	username: string;
	team: string;
	slot: number;
	status: string;
	mods: string[];
	isHost: boolean;

	constructor() {
		this.username = 'Open';
		this.team = 'invalid';
		this.status = 'Not ready';
		this.mods = [];
		this.isHost = false;
	}

	public static makeTrueCopy(player: MultiplayerLobbyPlayersPlayer): MultiplayerLobbyPlayersPlayer {
		const newPlayer = new MultiplayerLobbyPlayersPlayer();

		newPlayer.slot = player.slot;
		newPlayer.username = player.username;
		newPlayer.team = player.team;
		newPlayer.status = player.status;
		newPlayer.mods = player.mods;
		newPlayer.isHost = player.isHost;

		return newPlayer;
	}
}
