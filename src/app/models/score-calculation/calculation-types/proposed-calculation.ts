import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';

/**
 * This class is used to calculate scores using a custom formula.
 *
 * The following 2 methods are used to return the scores of the teams. You probably don't have to change these, so they can stay as is
 * - calculateTeamOneScore(): used to calculate the score of team one
 * - calculateTeamTwoScore(): used to calculate the score of team two
 *
 * The following methods are the actual formulas to calculate scores. These methods are the ones you want to change in order for scores to be affected
 * - calculateAccuracyPlayerScore(): used to calculate the score of the accuracy player. This is the player in slot 0 and 3
 * - calculateScorePlayerScore(): used to calculate the score of the score player. This is the player in slot 1, 2, 4, 5
 * - calculateTeamScore(): used to calculate the score of the full team
 *
 * These changes will be shown in `axs-formula.component`
 * In `axs-formula.component.ts` you will be able to change the modifier, look for `calculateScores()`, there you will be able to call the value inside of the `setModifier()`
 */
export class ProposedCalculation extends ScoreInterface {
	private modifier = 0;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setTeamSize(teamSize);
		this.setDescription('Proposed changes for AxS score, mess around and see what it does!');
		this.setSoloTournament(false);
	}

	public calculatePlayerScore(player: MultiplayerDataUser): number {
		return Number(player != null ? player.score : 0);
	}

	public calculateTeamOneScore() {
		const users: MultiplayerDataUser[] = [];

		for (let i = 0; i < this.getTeamSize(); i++) {
			const currentUser = this.getUserBySlot(i);

			if (currentUser.slot == 0) {
				currentUser.score = (currentUser.passed == 0 ? 0 : ProposedCalculation.calculateAccuracyPlayerScore(currentUser.score));
				currentUser.caption = 'Accuracy player';
			}
			else {
				currentUser.score = (currentUser.passed == 0 ? 0 : ProposedCalculation.calculateScorePlayerScore(currentUser.score, currentUser.accuracy, this.modifier));
				currentUser.caption = 'Score player';
			}

			users.push(currentUser);
		}

		return ProposedCalculation.calculateTeamScore(users[0].score, users[1].score, users[2].score, users[0].accuracy, this.modifier);
	}

	public calculateTeamTwoScore() {
		const users: MultiplayerDataUser[] = [];

		for (let i = this.getTeamSize(); i < this.getTeamSize() * 2; i++) {
			const currentUser = this.getUserBySlot(i);

			if (currentUser.slot == 3) {
				currentUser.score = (currentUser.passed == 0 ? 0 : ProposedCalculation.calculateAccuracyPlayerScore(currentUser.score));
				currentUser.caption = 'Accuracy player';
			}
			else {
				currentUser.score = (currentUser.passed == 0 ? 0 : ProposedCalculation.calculateScorePlayerScore(currentUser.score, currentUser.accuracy, this.modifier));
				currentUser.caption = 'Score player';
			}

			users.push(currentUser);
		}

		return ProposedCalculation.calculateTeamScore(users[0].score, users[1].score, users[2].score, users[0].accuracy, this.modifier);
	}

	public getModifier() {
		return this.modifier;
	}

	public setModifier(modifier: number) {
		this.modifier = modifier;
	}

	/**
	 * Calculate the score of the accuracy player
	 * @param score the full score of the accuracy player
	 */
	public static calculateAccuracyPlayerScore(score: number) {
		return (score * 0.2);
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
	public static calculateTeamScore(score_player_one: number, score_player_two: number, score_player_three: number, accuracy_player_one: number, modifier: number): number {
		return Number((((score_player_one) + (score_player_two) + (score_player_three)) * (Math.pow(accuracy_player_one / 100, modifier))).toFixed());
	}
}
