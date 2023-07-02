import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';
import { Mods } from 'app/models/osu-models/osu';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';

export class CTMCalculation extends ScoreInterface {
	private readonly ADD_BONUS_SCORE_FOR_DAMAGE_AMOUNT = [6, 8];
	private readonly MAX_BONUS_SCORE = 150000;

	private readonly EASY_BONUS_SCORE = 525000;
	private readonly HARDROCK_BONUS_SCORE = 50000;
	private readonly DOUBLETIME_BONUS_SCORE = 75000;
	private readonly FLASHLIGHT_BONUS_SCORE = 100000;
	private readonly SUDDEN_DEATH_BONUS_SCORE = 150000;

	private teamOneBonusScore: number;
	private teamTwoBonusScore: number;

	private teamOneUsedEasy: boolean;
	private teamTwoUsedEasy: boolean;

	private beatmap: WyModBracketMap;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setTeamSize(teamSize);
		this.setDescription('The score calculation for Catch The Magic 4.');

		this.teamOneBonusScore = 0;
		this.teamTwoBonusScore = 0;

		this.teamOneUsedEasy = false;
		this.teamTwoUsedEasy = false;
	}

	calculatePlayerScore(player: MultiplayerDataUser, team: number): number {
		if (player.mods & Mods.Easy) {
			this.addTeamBonusScore(this.EASY_BONUS_SCORE, team);

			if (team == 1) {
				this.teamOneUsedEasy = true;
			}
			else if (team == 2) {
				this.teamTwoUsedEasy = true;
			}
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

		return Number(player != null ? player.passed == 1 ? player.score : 0 : 0);
	}

	calculateTeamOneScore() {
		let teamScore = 0;

		for (const player of this.getTeamRedUsers()) {
			teamScore += this.calculatePlayerScore(player, 1);
		}

		// Only add bonus score when the the proper damageAmount is used
		if (this.ADD_BONUS_SCORE_FOR_DAMAGE_AMOUNT.includes(this.beatmap.damageAmount)) {
			teamScore += this.getBonusScore(1);
		}

		return teamScore;
	}

	calculateTeamTwoScore() {
		let teamScore = 0;

		for (const player of this.getTeamBlueUsers()) {
			teamScore += this.calculatePlayerScore(player, 2);
		}

		// Only add bonus score when the the proper damageAmount is used
		if (this.ADD_BONUS_SCORE_FOR_DAMAGE_AMOUNT.includes(this.beatmap.damageAmount)) {
			teamScore += this.getBonusScore(2);
		}


		return teamScore;
	}

	/**
	 * Set the beatmap so we can use the damageAmount
	 *
	 * @param beatmap the beatmap to use for the calculation
	 */
	setBeatmap(beatmap: WyModBracketMap) {
		this.beatmap = beatmap;
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
		const usedEasy = team == 1 ? this.teamOneUsedEasy : this.teamTwoUsedEasy;
		return usedEasy ? this.EASY_BONUS_SCORE : Math.min(team == 1 ? this.teamOneBonusScore : this.teamTwoBonusScore, this.MAX_BONUS_SCORE);
	}
}
