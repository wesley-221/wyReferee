import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { ScoreInterface } from './score-interface';

/**
 * Example score interface for making Hidden worth 1.06x again with ScoreV2
 */
export class TeamVsHiddenCalculation extends ScoreInterface {
	constructor(identifier: string) {
		super(identifier);

		this.setDescription('Team vs. with Hidden 1.06x modifier');
	}

	calculatePlayerScore(player: MultiplayerDataUser): number {
		let newScore = player.score;

		if (player.mods == 24) {
			newScore /= 1.12;
		}

		if (player.mods == 72) {
			newScore /= 1.06;
		}

		// Score is now without any modifiers
		newScore = Math.ceil(newScore);

		// Just hidden
		if (player.mods == 8) {
			newScore *= 1.06;
		}

		// Hidden + Hardrock
		if (player.mods == 24) {
			newScore *= 1.18;
		}

		// Hidden + Doubletime
		if (player.mods == 72) {
			newScore *= 1.12;
		}

		newScore = Math.ceil(newScore);

		return Number(player != null ? player.passed == 1 ? newScore : 0 : 0);
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
