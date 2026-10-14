export type MatchTeam = 'team1' | 'team2';
export type FlowActor = 'first' | 'second';
export type FlowAction = 'protect' | 'ban' | 'pick';
export type FlowPhaseOrder = 'alternate' | 'sequential';
export const FLOW_ACTIONS: FlowAction[] = ['protect', 'ban', 'pick'];

export function newFlowKey(): string {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export class FlowPhase {
	action: FlowAction;
	countPerTeam: number | null;
	useStageCount: boolean;
	order: FlowPhaseOrder;

	constructor(init?: Partial<FlowPhase>) {
		this.order = 'alternate';
		this.countPerTeam = 1;
		this.useStageCount = false;

		Object.assign(this, init);
	}

	static makeTrueCopy(phase: FlowPhase): FlowPhase {
		return new FlowPhase({
			action: phase.action,
			countPerTeam: phase.countPerTeam,
			useStageCount: phase.useStageCount,
			order: phase.order
		});
	}
}

export class FlowTrigger {
	id: number;
	key: string;
	name: string;
	subject: MatchTeam;
	threshold: number;
	repeatEvery: number | null;
	grantTo: 'subject' | 'opponent';
	action: FlowAction;
	count: number;

	constructor(init?: Partial<FlowTrigger>) {
		this.key = newFlowKey();
		this.repeatEvery = null;
		this.grantTo = 'opponent';
		this.count = 1;

		Object.assign(this, init);
	}

	static makeTrueCopy(trigger: FlowTrigger): FlowTrigger {
		return new FlowTrigger({
			id: trigger.id,
			key: trigger.key,
			name: trigger.name,
			subject: trigger.subject,
			threshold: trigger.threshold,
			repeatEvery: trigger.repeatEvery,
			grantTo: trigger.grantTo,
			action: trigger.action,
			count: trigger.count
		});
	}
}

export class MatchFlow {
	id: number;
	key: string;
	tournamentId: number;
	name: string;
	description: string;
	phases: FlowPhase[];
	triggers: FlowTrigger[];

	constructor(init?: Partial<MatchFlow>) {
		this.key = newFlowKey();
		this.phases = [];
		this.triggers = [];

		Object.assign(this, init);

		this.phases = this.phases.map(phase => FlowPhase.makeTrueCopy(phase));
		this.triggers = this.triggers.map(trigger => FlowTrigger.makeTrueCopy(trigger));
	}

	static makeTrueCopy(flow: MatchFlow): MatchFlow {
		return new MatchFlow({
			id: flow.id,
			key: flow.key,
			tournamentId: flow.tournamentId,
			name: flow.name,
			description: flow.description,
			phases: flow.phases.map(phase => FlowPhase.makeTrueCopy(phase)),
			triggers: flow.triggers.map(trigger => FlowTrigger.makeTrueCopy(trigger))
		});
	}
}
