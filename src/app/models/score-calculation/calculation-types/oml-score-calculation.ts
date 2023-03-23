import { Mods } from 'app/models/osu-models/osu';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { ScoreInterface } from './score-interface';

export class OMLScoreCalculation extends ScoreInterface {
	private modBracket: WyModBracket;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setDescription('The score calculation that is used for the osu!catch Master League. Mixed mod will have custom modifier: FL 1.00x');
		this.setTeamSize(teamSize);
	}

	calculatePlayerScore(player: MultiplayerDataUser): number {
		// Check if the mod bracket is Mixed mod, if so change scores
		if (this.modBracket && this.modBracket.name.toLowerCase() == 'mixed mod') {
			let newScore = player.score;

			if (player.mods & Mods.Flashlight) {
				newScore /= 1.12;
			}

			// Score is now without any modifiers
			newScore = Math.ceil(newScore);

			return Number(player != null ? player.passed == 1 ? newScore : 0 : 0);
		}

		return Number(player != null ? player.passed == 1 ? player.score : 0 : 0);
	}

	calculateTeamOneScore() {
		let teamScore = 0;

		for (let i = 0; i < this.getTeamSize(); i++) {
			teamScore += this.calculatePlayerScore(this.getUserBySlot(i));
		}

		return teamScore;
	}

	calculateTeamTwoScore() {
		let teamScore = 0;

		for (let i = this.getTeamSize(); i < this.getTeamSize() * 2; i++) {
			teamScore += this.calculatePlayerScore(this.getUserBySlot(i));
		}

		return teamScore;
	}

	public getModbracket() {
		return this.modBracket;
	}

	public setModBracket(modBracket: WyModBracket) {
		this.modBracket = modBracket;
	}
}
