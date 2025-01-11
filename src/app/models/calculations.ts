import { MultiplayerGameScore } from './osu-models/multiplayer-game-score';
import { Gamemodes } from './osu-models/osu';

export class Calculations {
	/**
	 * Calculate the accuracy from the given score
	 *
	 * @param score the MultiplayerGameScore to calculate
	 */
	public static getAccuracyOfScore(score: MultiplayerGameScore, gamemodeId?: number): number {
		gamemodeId = Number(gamemodeId);

		let accuracy: number;

		switch (gamemodeId) {
			case Gamemodes.Osu:
				accuracy = Number((((Number(score.count300) * 300) + (Number(score.count100) * 100) + (Number(score.count50) * 50)) /
					(300 * (Number(score.count300) + Number(score.count100) + Number(score.count50) + Number(score.countmiss))) * 100).toFixed(2));
				break;
			case Gamemodes.Mania:
				accuracy = Number((((Number(score.countgeki) * 305) + (Number(score.count300) * 300) + (Number(score.countkatu) * 200) + (Number(score.count100) * 100) + (Number(score.count50) * 50)) /
					(305 * (Number(score.countgeki) + Number(score.count300) + Number(score.countkatu) + Number(score.count100) + Number(score.count50) + Number(score.countmiss))) * 100).toFixed(2));
				break;
			case Gamemodes.Taiko:
				accuracy = Number(((Number(score.count300) + (Number(score.count100) * 0.5)) / (Number(score.count300) + Number(score.count100) + Number(score.countmiss)) * 100).toFixed(2));
				break;
			default:
				accuracy = Number(((Number(score.count50) + Number(score.count100) + Number(score.count300)) / (Number(score.count50) + Number(score.count100) + Number(score.count300) + Number(score.countmiss) + Number(score.countkatu)) * 100).toFixed(2));
				break;
		}

		return accuracy;
	}
}
