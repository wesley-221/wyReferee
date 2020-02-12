import { ScoreInterface } from "./calculation-types/score-interface";
import { TeamVsCalculation } from "./calculation-types/team-vs-calculation";
import { AxSCalculation } from "./calculation-types/axs-calculation";

export class Calculate {
    private scoreInterfaces: ScoreInterface[];

    constructor() {
        this.scoreInterfaces = [];

        this.addScoreInterface(new TeamVsCalculation("Team vs."));
        this.addScoreInterface(new AxSCalculation("AxS", 3));
    }

    /**
     * Get a score interface by the given identifier
     * @param identifier the identifier of the score interface
     */
    public getScoreInterface(identifier: string): ScoreInterface {
        for(let scoreInterface of this.scoreInterfaces) {
            if(scoreInterface.getIdentifier() == identifier) {
                return scoreInterface;
            }
        }

        return null;
    }

    /**
     * Add a score interface to the calculator
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
