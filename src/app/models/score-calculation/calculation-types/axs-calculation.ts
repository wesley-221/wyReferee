import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';

export class AxSCalculation extends ScoreInterface {
	private modifier = 0;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setTeamSize(3, false);
		this.setDescription(`The score calculation that is used for a tournament called AxS. The team size is set to ${teamSize}, where the first player in the multiplayerlobby is the accuracy player and the second and third are score players.`);
		this.setSoloTournament(false);
		this.setUseStaticSlots(true);
	}

	/**
	 * Calculate the score of a score player with the given modifier
	 *
	 * @param score the full score of the player
	 * @param accuracy the accuracy of the player
	 * @param modifier the modifier of the map
	 */
	public static calculateScorePlayerScore(player: MultiplayerDataUser, modifier: number) {
		return (player.score * (Math.pow((100 - ((100 - player.accuracy) / 5)) / 100, modifier)));
	}

	/**
	 * Calculate the team score with all the given scores and modifier
	 *
	 * @param score_player_one the final calculated score of player one
	 * @param score_player_two the final calculated score of player two
	 * @param score_player_three the final calculated score of player three
	 * @param accuracy_player_one the accuracy of player one
	 * @param modifier the modifier of the map
	 */
	public static calculateTeamScore(playerOne: MultiplayerDataUser, playerTwo: MultiplayerDataUser, playerThree: MultiplayerDataUser, modifier: number): number {
		return Number(((playerOne.score + playerTwo.score + playerThree.score) * Math.pow((((playerOne.accuracy * 0.5) + (playerTwo.accuracy * 0.25) + (playerThree.accuracy * 0.25)) / 100), modifier)).toFixed());
	}

	public calculatePlayerScore(): number {
		throw new Error('Method not implemented.');
	}

	public calculateTeamOneScore() {
		const users = {};

		for (let i = 0; i < this.getTeamSize(); i++) {
			const currentUser = this.getUserBySlot(i);

			if (currentUser.slot == 0) {
				currentUser.score = (currentUser.passed == 0 ? 0 : AxSCalculation.calculateScorePlayerScore(currentUser, this.modifier));
				currentUser.caption = 'Accuracy player';
			}
			else {
				currentUser.score = (currentUser.passed == 0 ? 0 : AxSCalculation.calculateScorePlayerScore(currentUser, this.modifier));
				currentUser.caption = 'Score player';
			}

			users[currentUser.slot] = currentUser;
		}

		for (const slot of [0, 1, 2]) {
			if (!users.hasOwnProperty(slot)) {
				const newUser = new MultiplayerDataUser();

				newUser.slot = slot;
				newUser.score = 0;
				newUser.passed = 0;
				newUser.accuracy = 0;
				newUser.mods = null;

				users[slot] = newUser;
			}
		}

		return AxSCalculation.calculateTeamScore(users[0], users[1], users[2], this.modifier);
	}

	public calculateTeamTwoScore() {
		const users = {};

		for (let i = this.getTeamSize(); i < this.getTeamSize() * 2; i++) {
			const currentUser = this.getUserBySlot(i);

			if (currentUser.slot == 3) {
				currentUser.score = (currentUser.passed == 0 ? 0 : AxSCalculation.calculateScorePlayerScore(currentUser, this.modifier));
				currentUser.caption = 'Accuracy player';
			}
			else {
				currentUser.score = (currentUser.passed == 0 ? 0 : AxSCalculation.calculateScorePlayerScore(currentUser, this.modifier));
				currentUser.caption = 'Score player';
			}

			users[currentUser.slot - 3] = currentUser;
		}

		for (const slot of [3, 4, 5]) {
			if (!users.hasOwnProperty(slot - 3)) {
				const newUser = new MultiplayerDataUser();

				newUser.slot = slot;
				newUser.score = 0;
				newUser.passed = 0;
				newUser.accuracy = 0;
				newUser.mods = null;

				users[slot - 3] = newUser;
			}
		}

		return AxSCalculation.calculateTeamScore(users[0], users[1], users[2], this.modifier);
	}

	public getModifier() {
		return this.modifier;
	}

	public setModifier(modifier: number) {
		this.modifier = modifier;
	}
}
