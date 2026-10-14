import { newFlowKey } from "./match-flow";
import { MatchFlowAction } from "./match-flow-phase";
export type MatchTeam = 'team1' | 'team2';

export class MatchFlowTrigger {
	id: number;
	matchFlowTriggerKey: string;
	subject: MatchTeam;
	threshold: number;
	repeatEvery: number | null;
	grantTo: 'subject' | 'opponent';
	action: MatchFlowAction;
	count: number;

	constructor(init?: Partial<MatchFlowTrigger>) {
		this.matchFlowTriggerKey = newFlowKey();
		this.repeatEvery = null;
		this.grantTo = 'opponent';
		this.count = 1;

		Object.assign(this, init);
	}

	static makeTrueCopy(trigger: MatchFlowTrigger): MatchFlowTrigger {
		return new MatchFlowTrigger({
			id: trigger.id,
			matchFlowTriggerKey: trigger.matchFlowTriggerKey,
			subject: trigger.subject,
			threshold: trigger.threshold,
			repeatEvery: trigger.repeatEvery,
			grantTo: trigger.grantTo,
			action: trigger.action,
			count: trigger.count
		});
	}
}
