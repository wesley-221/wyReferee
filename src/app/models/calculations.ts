import { MultiplayerGameScore } from "./osu-models/multiplayer-game-score";

export class Calculations {
    /**
     * Calculate the accuracy from the given score
     * @param score the MultiplayerGameScore to calculate
     */
    public static getAccuracyOfScore(score: MultiplayerGameScore): number {
        return Number(((Number(score.count50) + Number(score.count100) + Number(score.count300)) / (Number(score.count50) + Number(score.count100) + Number(score.count300) + Number(score.countmiss) + Number(score.countkatu)) * 100).toFixed(2));
    }
}
