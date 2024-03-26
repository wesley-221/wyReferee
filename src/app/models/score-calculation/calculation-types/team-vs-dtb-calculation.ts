import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';

export const DodgeTheBeatNames = [
	'dodgethebeat',
	'dodge the beat',
	'dtb'
];

export class TeamVsDodgeTheBeatCalculation extends ScoreInterface {
	constructor(identifier: string) {
		super(identifier);

		const dtbString = DodgeTheBeatNames.join(', ');

		this.setDescription('The regular team versus team score calculation. Uses reverse scoring for Dodge The Beat. Dodge The Beat mod bracket should be named one of the following names in order for it to work: ' + dtbString + '.');
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
