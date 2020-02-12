import { ScoreInterface } from "./score-interface";
import { MultiplayerDataUser } from "../../store-multiplayer/multiplayer-data-user";

export class TeamVsCalculation extends ScoreInterface {
	constructor(identifier: string) {
		super(identifier);

		this.setDescription(`The regular team versus team score calculation.`);
	}

    calculatePlayerScore(player: MultiplayerDataUser): number {
        return Number(player != null ? player.score : 0);
    }

    calculateTeamOneScore() {
        let teamScore: number = 0;

        for(let i = 0; i < this.getTeamSize(); i ++) {
            teamScore += this.calculatePlayerScore(this.getUserScoreBySlot(i));
        }

        return teamScore;
    }

    calculateTeamTwoScore() {
        let teamScore: number = 0;

        for(let i = this.getTeamSize(); i < this.getTeamSize() * 2; i ++) {
            teamScore += this.calculatePlayerScore(this.getUserScoreBySlot(i));
        }

        return teamScore;
    }
}
