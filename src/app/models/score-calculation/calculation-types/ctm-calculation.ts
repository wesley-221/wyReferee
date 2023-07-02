import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';
import { Mods } from 'app/models/osu-models/osu';

export class CTMCalculation extends ScoreInterface {
	private readonly MAX_BONUS_SCORE = 150000;

	private readonly EASY_ONLY_BONUS_SCORE = 500000;
	private readonly EASY_BONUS_SCORE = 25000;
	private readonly HARDROCK_BONUS_SCORE = 50000;
	private readonly DOUBLETIME_BONUS_SCORE = 75000;
	private readonly FLASHLIGHT_BONUS_SCORE = 100000;
	private readonly SUDDEN_DEATH_BONUS_SCORE = 150000;

	private teamOneBonusScore: number;
	private teamTwoBonusScore: number;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setTeamSize(teamSize);
		this.setDescription('The score calculation for Catch The Magic 4.');

		this.teamOneBonusScore = 0;
		this.teamTwoBonusScore = 0;
	}

	calculatePlayerScore(player: MultiplayerDataUser, team: number): number {
		let easyOnlyWasUsed = false;

		if ((player.mods & Mods.Easy) == player.mods || (player.mods & (Mods.Easy | Mods.NoFail)) == player.mods) {
			this.addTeamBonusScore(this.EASY_BONUS_SCORE, team);
			easyOnlyWasUsed = true;
		}

		if (player.mods & Mods.Easy && easyOnlyWasUsed == false) {
			this.addTeamBonusScore(this.EASY_BONUS_SCORE, team);
		}

		if (player.mods & Mods.HardRock) {
			this.addTeamBonusScore(this.HARDROCK_BONUS_SCORE, team);
		}

		if (player.mods & Mods.DoubleTime) {
			this.addTeamBonusScore(this.DOUBLETIME_BONUS_SCORE, team);
		}

		if (player.mods & Mods.Flashlight) {
			this.addTeamBonusScore(this.FLASHLIGHT_BONUS_SCORE, team);
		}

		if (player.mods & Mods.SuddenDeath) {
			this.addTeamBonusScore(this.SUDDEN_DEATH_BONUS_SCORE, team);
		}

		if (easyOnlyWasUsed == true) {
			player.score += this.EASY_ONLY_BONUS_SCORE;
		}

		return Number(player != null ? player.passed == 1 ? player.score : 0 : 0);
	}

	calculateTeamOneScore() {
		let teamScore = 0;

		for (const player of this.getTeamRedUsers()) {
			teamScore += this.calculatePlayerScore(player, 1);
		}

		teamScore += this.getBonusScore(1);

		return teamScore;
	}

	calculateTeamTwoScore() {
		let teamScore = 0;

		for (const player of this.getTeamBlueUsers()) {
			teamScore += this.calculatePlayerScore(player, 2);
		}

		teamScore += this.getBonusScore(2);

		return teamScore;
	}

	/**
	 * Add bonus score to the team's bonus score variable
	 *
	 * @param score the score to add to the team's bonus score
	 * @param team the team to add the bonus score to
	 */
	private addTeamBonusScore(score: number, team: number) {
		if (team == 1) {
			this.teamOneBonusScore += score;
		}
		else if (team == 2) {
			this.teamTwoBonusScore += score;
		}
	}

	/**
	 * Get the bonus score for the given team, this caps at the amount MAX_BONUS_SCORE is set to
	 *
	 * @param team the team to get the bonus score from
	 */
	private getBonusScore(team: number) {
		return Math.min(team == 1 ? this.teamOneBonusScore : this.teamTwoBonusScore, this.MAX_BONUS_SCORE);
	}
}
