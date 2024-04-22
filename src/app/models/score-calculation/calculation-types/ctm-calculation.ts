import { ScoreInterface } from './score-interface';
import { MultiplayerDataUser } from '../../store-multiplayer/multiplayer-data-user';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { Mods } from 'app/models/osu-models/osu';

export class CTMCalculation extends ScoreInterface {
	private modBracket: WyModBracket;

	private readonly FREEMOD_BRACKET_NAMES = [
		'freemod',
		'free mod'
	];

	private readonly SUDDEN_DEATH_BONUS = 60000;
	private readonly HIDDEN_BONUS = 60000;
	private readonly DOUBLETIME_BONUS = 60000;
	private readonly HARDROCK_BONUS = 60000;
	private readonly EASY_BONUS = 440000;

	constructor(identifier: string) {
		super(identifier);

		this.setDescription('The score calculation for Catch The Magic.');
	}

	calculatePlayerScore(player: MultiplayerDataUser): number {
		if (this.modBracket && this.FREEMOD_BRACKET_NAMES.includes(this.modBracket.name.toLowerCase())) {
			let newScore = player.score;

			if (player.mods & Mods.SuddenDeath) {
				newScore += this.SUDDEN_DEATH_BONUS;
			}

			if (player.mods & Mods.Hidden) {
				newScore += this.HIDDEN_BONUS;
			}

			if (player.mods & Mods.DoubleTime) {
				newScore += this.DOUBLETIME_BONUS;
			}

			if (player.mods & Mods.HardRock) {
				newScore += this.HARDROCK_BONUS;
			}

			if (player.mods & Mods.Easy) {
				newScore += this.EASY_BONUS;
			}

			// Score is now without any modifiers
			newScore = Math.ceil(newScore);

			return Number(player != null ? player.passed == 1 ? newScore : 0 : 0);
		}

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

	public getModbracket() {
		return this.modBracket;
	}

	public setModBracket(modBracket: WyModBracket) {
		this.modBracket = modBracket;
	}
}
