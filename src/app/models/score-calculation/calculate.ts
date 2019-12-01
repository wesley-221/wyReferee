import { ScoreInterface } from "./calculation-types/score-interface";
import { TeamVsCalculation } from "./calculation-types/team-vs-calculation";

export class Calculate {
    private scoreInterfaces: ScoreInterface[];

    constructor() {
        this.scoreInterfaces = [];

        this.addScoreInterface(new TeamVsCalculation("Team vs."));
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
}
