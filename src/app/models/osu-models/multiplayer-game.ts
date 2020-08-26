import { Gamemodes, Mods } from './osu';
import { MultiplayerGameScore } from './multiplayer-game-score';

export class MultiplayerGame {
	game_id: number;
	start_time: Date;
	end_time: Date;
	beatmap_id: number;
	play_mode: Gamemodes;
	match_type: number;
	scoring_type: number;
	team_type: number;
	mods: Mods;

	scores: MultiplayerGameScore[];

	constructor() {
		this.scores = [];
	}
}
