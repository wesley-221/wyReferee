import { ScoreInterface } from "./score-interface";
import { MultiplayerDataUser } from "../../store-multiplayer/multiplayer-data-user";

export class TeamVsCalculation extends ScoreInterface {
    calculatePlayerScore(player: MultiplayerDataUser) {
        return player.score;
    }

    calculateTeamScore() {
        let teamScore = 0;

        for(let user of this.getUsers()) {
            teamScore += this.calculatePlayerScore(user);
        }

        return teamScore;
    }
}