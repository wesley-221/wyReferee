import { MatchFlowPhase } from "./match-flow-phase";
import { MatchFlowTrigger } from "./match-flow-trigger";

export type MatchFlowActor = 'first' | 'second';

export function newFlowKey(): string {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export class MatchFlow {
	id: number;
	matchFlowKey: string;
	name: string;
	description: string;
	phases: MatchFlowPhase[];
	triggers: MatchFlowTrigger[];

	constructor(init?: Partial<MatchFlow>) {
		this.matchFlowKey = newFlowKey();
		this.phases = [];
		this.triggers = [];

		Object.assign(this, init);

		this.phases = this.phases.map(phase => MatchFlowPhase.makeTrueCopy(phase));
		this.triggers = this.triggers.map(trigger => MatchFlowTrigger.makeTrueCopy(trigger));
	}

	static makeTrueCopy(flow: MatchFlow): MatchFlow {
		return new MatchFlow({
			id: flow.id,
			matchFlowKey: flow.matchFlowKey,
			name: flow.name,
			description: flow.description,
			phases: flow.phases.map(phase => MatchFlowPhase.makeTrueCopy(phase)),
			triggers: flow.triggers.map(trigger => MatchFlowTrigger.makeTrueCopy(trigger))
		});
	}
}
