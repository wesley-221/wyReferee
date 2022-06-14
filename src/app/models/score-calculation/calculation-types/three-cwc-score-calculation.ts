import { Mods } from 'app/models/osu-models/osu';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { ScoreInterface } from './score-interface';

export class ThreeCwcScoreCalculation extends ScoreInterface {
	private modBracket: WyModBracket;

	constructor(identifier: string, teamSize: number) {
		super(identifier);

		this.setDescription('The score calculation that is used for the osu!catch 3 Digit World Cup. Mixed mod will have custom modifiers: NM 1.00x, HD 1.03x, HR (+HD) 1.06x');
		this.setTeamSize(teamSize);
	}

	calculatePlayerScore(player: MultiplayerDataUser): number {
		// Check if the mod bracket is Mixed mod, if so change scores
		if (this.modBracket.name.toLowerCase() == "mixed mod") {
			let newScore = player.score;

			if (player.mods & (Mods.HardRock || Mods.HardRock + Mods.Hidden)) {
				newScore /= 1.12;
			}

			// Score is now without any modifiers
			newScore = Math.ceil(newScore);

			if (player.mods & (Mods.HardRock || Mods.HardRock + Mods.Hidden)) {
				newScore *= 1.06;
			}
			else if (player.mods & Mods.Hidden) {
				newScore *= 1.03;
			}

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
