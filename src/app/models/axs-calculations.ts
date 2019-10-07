import { MultiplayerGameScore } from "./multiplayer-game-score";

export class AxsCalculations {
    /**
     * Calculate the score of the accuracy player
     * @param score the full score of the accuracy player
     */
    public static calculateAccuracyPlayerScore(score: number) {
        return (score * 0.2);
    }

    /**
     * Calculate the accuracy from the given score
     * @param score the MultiplayerGameScore to calculate
     */
    public static getAccuracyOfScore(score: MultiplayerGameScore): number {
        return Number(((Number(score.count50) + Number(score.count100) + Number(score.count300)) / (Number(score.count50) + Number(score.count100) + Number(score.count300) + Number(score.countmiss) + Number(score.countkatu)) * 100).toFixed(2));
    }

    /**
     * Calculate the score of a score player with the given modifier
     * @param score the full score of the player
     * @param accuracy the accuracy of the player
     * @param modifier the modifier of the map
     */
    public static calculateScorePlayerScore(score: number, accuracy: number, modifier: number) {        
        return (score * (Math.pow((100 - ((100 - accuracy) / 5)) / 100, modifier)));
    }

    /**
     * Calculate the team score with all the given scores and modifier
     * @param score_player_one the final calculated score of player one
     * @param score_player_two the final calculated score of player two
     * @param score_player_three the final calculated score of player three
     * @param accuracy_player_one the accuracy of player one
     * @param modifier the modifier of the map
     */
    public static calculateTeamScore(score_player_one: number, score_player_two: number, score_player_three: number, accuracy_player_one:number, modifier:number): number {
        return Number((((score_player_one) + (score_player_two) + (score_player_three)) * (Math.pow(accuracy_player_one / 100, modifier))).toFixed());
    }
}
