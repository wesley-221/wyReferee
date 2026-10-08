import { FlowAction, FlowActor, FlowPhase, MatchFlow, MatchTeam } from './match-flow';

export interface ProcedureStep {
	action: FlowAction;
	actor?: FlowActor;
	team?: MatchTeam;
	source: 'phase' | 'trigger';
	status: 'pending' | 'done';
	beatmapId?: number;
	open?: boolean;
}

export interface FiredTrigger {
	triggerKey: string;
	timesFired: number;
}

export type FirstTeams = Record<FlowAction, MatchTeam>;

export interface MatchProcedure {
	flowId: number;
	firstTeams: FirstTeams;
	steps: ProcedureStep[];
	openPhase: Pick<FlowPhase, 'action' | 'order'> | null;
	firedTriggers: FiredTrigger[];
}

export interface CurrentTurn {
	action: FlowAction;
	team: MatchTeam;
	open: boolean;
}

export interface MatchProgress {
	firstTeams: FirstTeams;
	stage?: { bans: number; protects: number };
	score: Record<MatchTeam, number>;
	done: Record<'protect' | 'ban', Record<MatchTeam, number>>;
	nextPickTeam: MatchTeam;
}

export class MatchFlowEngine {
	/**
	 * Get the other team
	 *
	 * @param team the team to get the opponent of
	 */
	public static opponent(team: MatchTeam): MatchTeam {
		return team === 'team1' ? 'team2' : 'team1';
	}

	/**
	 * Turn a match flow into a procedure with all the steps of its phases
	 *
	 * @param flow the match flow to compile
	 * @param firstTeam the team that goes first, either for every action or per action
	 * @param stage the ban and protect count of the stage, used by phases that take their amount from the stage
	 */
	public static compile(flow: MatchFlow, firstTeam: MatchTeam | FirstTeams, stage?: { bans: number; protects: number }): MatchProcedure {
		const steps: ProcedureStep[] = [];
		let openPhase: MatchProcedure['openPhase'] = null;

		for (const phase of flow.phases) {
			if (phase.countPerTeam === null) {
				openPhase = { action: phase.action, order: phase.order };
				break;
			}

			const countPerTeam = this.getCountPerTeam(phase, stage);
			const actors: FlowActor[] = [];

			if (phase.order === 'alternate') {
				for (let i = 0; i < countPerTeam; i++) {
					actors.push('first', 'second');
				}
			}
			else {
				for (let i = 0; i < countPerTeam; i++) {
					actors.push('first');
				}

				for (let i = 0; i < countPerTeam; i++) {
					actors.push('second');
				}
			}

			actors.forEach(actor => steps.push({ action: phase.action, actor, source: 'phase', status: 'pending' }));
		}

		const firstTeams: FirstTeams = typeof firstTeam === 'string' ? { protect: firstTeam, ban: firstTeam, pick: firstTeam } : { ...firstTeam };

		return { flowId: flow.id, firstTeams, steps, openPhase, firedTriggers: [] };
	}

	/**
	 * Get the amount of actions each team gets in a phase
	 *
	 * @param phase the phase to get the amount for
	 * @param stage the ban and protect count of the stage, used when the phase takes its amount from the stage
	 */
	public static getCountPerTeam(phase: FlowPhase, stage?: { bans: number; protects: number }): number {
		if (phase.useStageCount && stage && phase.action !== 'pick') {
			return (phase.action === 'ban' ? stage.bans : stage.protects) || 0;
		}

		return phase.countPerTeam ?? 0;
	}

	/**
	 * Get the team that has to perform a step in the match procedure
	 *
	 * @param procedure the procedure that holds the first teams
	 * @param step the step to resolve the team for
	 */
	public static resolveTeam(procedure: MatchProcedure, step: Pick<ProcedureStep, 'action' | 'actor' | 'team'>): MatchTeam {
		if (step.team) return step.team;

		const first = procedure.firstTeams[step.action];

		return step.actor === 'first' ? first : this.opponent(first);
	}

	/**
	 * Overwrite which team goes first, for example after the referee has changed the first pick
	 *
	 * @param procedure the procedure to update
	 * @param firstTeam the team that goes first
	 * @param action only change the first team of this action, changes every action when omitted
	 */
	public static setFirstTeam(procedure: MatchProcedure, firstTeam: MatchTeam, action?: FlowAction): void {
		if (action) {
			procedure.firstTeams[action] = firstTeam;
		}
		else {
			procedure.firstTeams = { protect: firstTeam, ban: firstTeam, pick: firstTeam };
		}
	}

	/**
	 * Get the action that has to be performed next
	 *
	 * @param procedure the procedure to get the turn from
	 */
	public static getCurrentTurn(procedure: MatchProcedure): CurrentTurn | null {
		const step = procedure.steps.find(s => s.status === 'pending');

		if (step) {
			return { action: step.action, team: this.resolveTeam(procedure, step), open: false };
		}

		if (procedure.openPhase) {
			const openCount = procedure.steps.filter(s => s.open).length;
			const actor: FlowActor = openCount % 2 === 0 ? 'first' : 'second';

			return { action: procedure.openPhase.action, team: this.resolveTeam(procedure, { action: procedure.openPhase.action, actor }), open: true };
		}

		return null;
	}

	/**
	 * Mark the current turn as done
	 *
	 * @param procedure the procedure to update
	 * @param beatmapId the beatmap that was protected, banned or picked
	 */
	public static completeCurrentTurn(procedure: MatchProcedure, beatmapId?: number): void {
		const step = procedure.steps.find(s => s.status === 'pending');

		if (step) {
			step.status = 'done';
			step.beatmapId = beatmapId;

			return;
		}

		const turn = this.getCurrentTurn(procedure);

		if (turn) {
			const openCount = procedure.steps.filter(s => s.open).length;

			procedure.steps.push({
				action: turn.action,
				actor: openCount % 2 === 0 ? 'first' : 'second',
				source: 'phase',
				status: 'done',
				open: true,
				beatmapId
			});
		}
	}

	/**
	 * Add the extra actions of every trigger based on the score
	 *
	 * @param procedure the procedure to add the extra actions to
	 * @param flow the flow that holds the triggers
	 * @param score the current match score of both teams
	 */
	public static applyScore(procedure: MatchProcedure, flow: MatchFlow, score: Record<MatchTeam, number>): void {
		const extra: ProcedureStep[] = [];

		for (const trigger of flow.triggers) {
			const value = score[trigger.subject];
			let timesReached = 0;

			if (value >= trigger.threshold) {
				timesReached = trigger.repeatEvery && trigger.repeatEvery > 0 ? 1 + Math.floor((value - trigger.threshold) / trigger.repeatEvery) : 1;
			}

			let fired = procedure.firedTriggers.find(f => f.triggerKey === trigger.key);

			if (!fired) {
				fired = { triggerKey: trigger.key, timesFired: 0 };
				procedure.firedTriggers.push(fired);
			}

			const newFirings = timesReached - fired.timesFired;

			if (newFirings <= 0) continue;

			const team = trigger.grantTo === 'subject' ? trigger.subject : this.opponent(trigger.subject);

			for (let i = 0; i < newFirings * trigger.count; i++) {
				extra.push({ action: trigger.action, team, source: 'trigger', status: 'pending' });
			}

			fired.timesFired = timesReached;
		}

		const pendingIndex = procedure.steps.findIndex(s => s.status === 'pending');
		const insertAt = pendingIndex === -1 ? procedure.steps.length : pendingIndex;

		procedure.steps.splice(insertAt, 0, ...extra);
	}

	/**
	 * Get the action that has to be performed next based on the progress of a match
	 *
	 * @param flow the match flow to follow
	 * @param progress the progress of the match
	 */
	public static getCurrentTurnFromProgress(flow: MatchFlow, progress: MatchProgress): CurrentTurn | null {
		const procedure = this.compile(flow, progress.firstTeams, progress.stage);

		this.applyScore(procedure, flow, progress.score);

		const remaining: Record<string, number> = {};

		for (const action of ['protect', 'ban'] as FlowAction[]) {
			for (const team of ['team1', 'team2'] as MatchTeam[]) {
				remaining[`${action}-${team}`] = progress.done[action][team];
			}
		}

		for (const step of procedure.steps) {
			if (step.action === 'pick') {
				return { action: 'pick', team: progress.nextPickTeam, open: false };
			}

			const key = `${step.action}-${this.resolveTeam(procedure, step)}`;

			if (remaining[key] > 0) {
				remaining[key]--;

				continue;
			}

			return { action: step.action, team: this.resolveTeam(procedure, step), open: false };
		}

		return procedure.openPhase ? { action: procedure.openPhase.action, team: progress.nextPickTeam, open: true } : null;
	}
}
