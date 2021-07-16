import { Mods } from '../osu-models/osu';
import { MultiplayerDataUser } from './multiplayer-data-user';

export class MultiplayerData {
	game_id: number;
	beatmap_id: number;
	mods: Mods;
	team_one_score: number;
	team_two_score: number;
	private players: MultiplayerDataUser[];

	constructor(init?: Partial<MultiplayerData>) {
		this.players = [];

		Object.assign(this, init);
	}

	public static makeTrueCopy(multiplayerData: MultiplayerData): MultiplayerData {
		const newMultiplayerData = new MultiplayerData({
			game_id: multiplayerData.game_id,
			beatmap_id: multiplayerData.beatmap_id,
			mods: multiplayerData.mods,
			team_one_score: multiplayerData.team_one_score,
			team_two_score: multiplayerData.team_two_score
		});

		for (const player in multiplayerData.players) {
			newMultiplayerData.players.push(MultiplayerDataUser.makeTrueCopy(multiplayerData.players[player]));
		}

		return newMultiplayerData;
	}

	/**
	 * Add a player to the MultiplayerData
	 * @param player the player to add
	 */
	addPlayer(player: MultiplayerDataUser) {
		this.players[player.slot] = player;
	}

	/**
	 * Get a specific player from the given slot
	 * @param slot the slot of the player
	 */
	getPlayer(slot: number) {
		const player = new MultiplayerDataUser();

		if (this.players[slot] == undefined) {
			player.user = 0;
			player.accuracy = 0;
			player.score = 0;
			player.passed = 0;
			player.slot = slot;
		}

		return (this.players[slot] == undefined) ? player : this.players[slot];
	}

	/**
	 * Return all the players
	 */
	getPlayers(): MultiplayerDataUser[] {
		return this.players;
	}

	/**
	 * Get the player count
	 */
	getPlayerCount() {
		return Object.keys(this.players).length;
	}
}
