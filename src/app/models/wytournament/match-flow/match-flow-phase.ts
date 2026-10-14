export type MatchFlowPhaseOrder = 'alternate' | 'sequential';
export type MatchFlowAction = 'protect' | 'ban' | 'pick';
export const FLOW_ACTIONS: MatchFlowAction[] = ['protect', 'ban', 'pick'];

export class MatchFlowPhase {
	id: number;
	action: MatchFlowAction;
	countPerTeam: number | null;
	useStageCount: boolean;
	phaseOrder: MatchFlowPhaseOrder;

	constructor(init?: Partial<MatchFlowPhase>) {
		this.phaseOrder = 'alternate';
		this.countPerTeam = 1;
		this.useStageCount = false;

		Object.assign(this, init);
	}

	static makeTrueCopy(phase: MatchFlowPhase): MatchFlowPhase {
		return new MatchFlowPhase({
			id: phase.id,
			action: phase.action,
			countPerTeam: phase.countPerTeam,
			useStageCount: phase.useStageCount,
			phaseOrder: phase.phaseOrder
		});
	}
}
