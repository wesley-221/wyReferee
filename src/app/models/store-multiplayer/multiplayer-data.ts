import { Mods } from '../osu-models/osu';
import { MultiplayerDataUser, Team } from './multiplayer-data-user';

export class MultiplayerData {
	game_id: number;
	beatmap_id: number;
	mods: Mods;
	team_one_score: number;
	team_two_score: number;
	team_one_health: number;
	team_two_health: number;
	team_one_accuracy: number;
	team_two_accuracy: number;
	team_one_misses: number;
	team_two_misses: number;
	teamRedPlayers: MultiplayerDataUser[];
	teamBluePlayers: MultiplayerDataUser[];
	private players: MultiplayerDataUser[];

	constructor(init?: Partial<MultiplayerData>) {
		this.players = [];
		this.teamRedPlayers = [];
		this.teamBluePlayers = [];

		Object.assign(this, init);
	}

	public static makeTrueCopy(multiplayerData: MultiplayerData): MultiplayerData {
		const newMultiplayerData = new MultiplayerData({
			game_id: multiplayerData.game_id,
			beatmap_id: multiplayerData.beatmap_id,
			mods: multiplayerData.mods,
			team_one_score: multiplayerData.team_one_score,
			team_two_score: multiplayerData.team_two_score,
			team_one_health: multiplayerData.team_one_health,
			team_two_health: multiplayerData.team_two_health,
			team_one_accuracy: multiplayerData.team_one_accuracy,
			team_two_accuracy: multiplayerData.team_two_accuracy,
			team_one_misses: multiplayerData.team_one_misses,
			team_two_misses: multiplayerData.team_two_misses
		});

		for (const player in multiplayerData.players) {
			if (multiplayerData.players[player] != null) {
				newMultiplayerData.players.push(MultiplayerDataUser.makeTrueCopy(multiplayerData.players[player]));

				if (multiplayerData.players[player].team == Team.Red as number) {
					newMultiplayerData.teamRedPlayers.push(multiplayerData.players[player]);
				}
				else if (multiplayerData.players[player].team == Team.Blue as number) {
					newMultiplayerData.teamBluePlayers.push(multiplayerData.players[player]);
				}
			}
		}

		return newMultiplayerData;
	}

	/**
	 * Add a player to the MultiplayerData
	 *
	 * @param player the player to add
	 */
	addPlayer(player: MultiplayerDataUser) {
		this.players[player.slot] = player;
	}

	/**
	 * Get a specific player from the given slot
	 *
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

	/**
	 * Get the accuracy for team one
	 */
	getTeamOneAccuracy(): number {
		if (this.team_one_accuracy != null && !isNaN(this.team_one_accuracy)) {
			return this.team_one_accuracy;
		}

		return MultiplayerData.calculateAverageAccuracy(this.teamRedPlayers);
	}

	/**
	 * Get the accuracy for team two
	 */
	getTeamTwoAccuracy(): number {
		if (this.team_two_accuracy != null && !isNaN(this.team_two_accuracy)) {
			return this.team_two_accuracy;
		}

		return MultiplayerData.calculateAverageAccuracy(this.teamBluePlayers);
	}

	/**
	 * Get the total misses for team one
	 */
	getTeamOneMisses(): number {
		if (this.team_one_misses != null && !isNaN(this.team_one_misses)) {
			return this.team_one_misses;
		}

		return MultiplayerData.calculateTotalMisses(this.teamRedPlayers);
	}

	/**
	 * Get the total misses for team two
	 */
	getTeamTwoMisses(): number {
		if (this.team_two_misses != null && !isNaN(this.team_two_misses)) {
			return this.team_two_misses;
		}

		return MultiplayerData.calculateTotalMisses(this.teamBluePlayers);
	}

	private static calculateAverageAccuracy(players: MultiplayerDataUser[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		let totalAccuracy = 0;

		for (const player of players) {
			if (player && player.passed == 1) {
				totalAccuracy += Number(player.accuracy || 0);
			}
		}

		return Number((totalAccuracy / players.length).toFixed(2));
	}

	private static calculateTotalMisses(players: MultiplayerDataUser[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		let totalMisses = 0;

		for (const player of players) {
			if (player) {
				totalMisses += Number(player.countmiss || 0);
			}
		}

		return totalMisses;
	}
}
