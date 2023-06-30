import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';

export class CTMCalculation extends ScoreInterface {
	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setTeamSize(teamSize);
		this.setDescription('The score calculation for Catch The Magic 4.');
	}

	calculatePlayerScore(player: MultiplayerDataUser): number {
		return Number(player != null ? player.passed == 1 ? player.score : 0 : 0);
	}

	calculateTeamOneScore() {
		let teamScore = 0;

		for (const player of this.getTeamRedUsers()) {
			teamScore += this.calculatePlayerScore(player);
		}

		return teamScore;
	}

	calculateTeamTwoScore() {
		let teamScore = 0;

		for (const player of this.getTeamBlueUsers()) {
			teamScore += this.calculatePlayerScore(player);
		}

		return teamScore;
	}
}
