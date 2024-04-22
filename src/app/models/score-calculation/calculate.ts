import { ScoreInterface } from './calculation-types/score-interface';
import { TeamVsCalculation } from './calculation-types/team-vs-calculation';
import { AxSCalculation } from './calculation-types/axs-calculation';
import { ThreeCwcScoreCalculation } from './calculation-types/three-cwc-score-calculation';
import { OMLScoreCalculation } from './calculation-types/oml-score-calculation';
import { CTMCalculation } from './calculation-types/ctm-calculation';
import { TeamVsDodgeTheBeatCalculation } from './calculation-types/team-vs-dtb-calculation';

export class Calculate {
	private scoreInterfaces: ScoreInterface[];

	constructor() {
		this.scoreInterfaces = [];

		this.addScoreInterface(new TeamVsCalculation('Team vs.'));
		this.addScoreInterface(new TeamVsDodgeTheBeatCalculation('Team vs. + Dodge The Beat'));
		this.addScoreInterface(new AxSCalculation('AxS', 3));
		this.addScoreInterface(new ThreeCwcScoreCalculation('osu!catch 3 Digit World Cup', 3));
		this.addScoreInterface(new OMLScoreCalculation('osu!catch Master League', 2));
		this.addScoreInterface(new CTMCalculation('CTM'));
	}

	/**
	 * Get a score interface by the given identifier
	 *
	 * @param identifier the identifier of the score interface
	 */
	public getScoreInterface(identifier: string): ScoreInterface {
		for (const scoreInterface of this.scoreInterfaces) {
			if (scoreInterface.getIdentifier() == identifier) {
				return scoreInterface;
			}
		}

		return null;
	}

	/**
	 * Add a score interface to the calculator
	 *
	 * @param scoreInterface the interface to add
	 */
	public addScoreInterface(scoreInterface: ScoreInterface) {
		this.scoreInterfaces.push(scoreInterface);
	}

	/**
	 * Get all the score interfaces
	 */
	public getAllScoreInterfaces(): ScoreInterface[] {
		return this.scoreInterfaces;
	}
}
