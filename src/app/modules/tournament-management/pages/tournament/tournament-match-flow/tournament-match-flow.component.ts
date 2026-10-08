import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, Subscription } from 'rxjs';
import { FLOW_ACTIONS, FlowAction, FlowPhase, FlowTrigger, MatchFlow, MatchTeam } from 'app/models/match-flow/match-flow';
import { MatchFlowEngine } from 'app/models/match-flow/match-flow-engine';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';

interface PreviewStep {
	action: FlowAction;
	team: MatchTeam;
}

@Component({
	selector: 'app-tournament-match-flow',
	templateUrl: './tournament-match-flow.component.html',
	styleUrl: './tournament-match-flow.component.scss'
})
export class TournamentMatchFlowComponent implements OnInit, OnDestroy {
	form: FormGroup;
	tournament: WyTournament;

	selectedIndex: number;
	previewFirstTeam: MatchTeam;

	readonly actionIcons: Record<FlowAction, string> = { protect: 'shield', ban: 'block', pick: 'check_circle' };

	private initialized: boolean;
	private subscriptions: Subscription[];

	constructor(private tournamentEditStateService: TournamentEditStateService) {
		this.form = new FormGroup({
			flows: new FormArray([])
		});

		this.selectedIndex = 0;
		this.previewFirstTeam = 'team1';
		this.initialized = false;
		this.subscriptions = [];
	}

	ngOnInit(): void {
		this.subscriptions.push(
			this.tournamentEditStateService.getDraft$()
				.pipe(filter(v => !!v))
				.subscribe(tournament => {
					this.tournament = tournament;

					if (!this.initialized) {
						this.initialized = true;

						this.form.setControl('flows', new FormArray(tournament.matchFlows.map(flow => this.createFlowGroup(flow))), { emitEvent: false });
					}
				}),

			this.form.valueChanges
				.pipe(debounceTime(200))
				.subscribe(() => {
					this.tournamentEditStateService.updateMatchFlowsForm(this.toMatchFlows());
				})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
	}

	get actions(): FlowAction[] {
		return FLOW_ACTIONS.filter(action => action !== 'protect' || this.tournament?.protects === true);
	}

	get flows(): FormArray {
		return this.form.get('flows') as FormArray;
	}

	get selectedFlow(): FormGroup | null {
		return (this.flows.at(this.selectedIndex) as FormGroup) ?? null;
	}

	get phases(): FormArray {
		return this.selectedFlow.get('phases') as FormArray;
	}

	get triggers(): FormArray {
		return this.selectedFlow.get('triggers') as FormArray;
	}

	/**
	 * Get the icon for the action of a phase form group
	 *
	 * @param phase the phase form group
	 */
	getPhaseIcon(phase: AbstractControl): string {
		return this.actionIcons[phase.get('action').value as FlowAction];
	}

	/**
	 * Adds a new flow with default values
	 */
	addFlow(): void {
		this.flows.push(this.createFlowGroup(new MatchFlow({
			name: `Match flow ${this.flows.length + 1}`,
			phases: [
				new FlowPhase({ action: 'ban', useStageCount: true }),
				new FlowPhase({ action: 'pick', countPerTeam: null })
			]
		})));

		this.selectedIndex = this.flows.length - 1;
	}

	/**
	 * Remove a flow and navigate back to the latest available flow
	 *
	 * @param index index of the flow to remove
	 */
	removeFlow(index: number): void {
		this.flows.removeAt(index);
		this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, this.flows.length - 1));
	}

	/**
	 * Select a flow
	 *
	 * @param index index of the flow to select
	 */
	selectFlow(index: number): void {
		this.selectedIndex = index;
	}

	/**
	 * Add a ban phase to the selected flow
	 */
	addPhase(): void {
		this.phases.push(this.createPhaseGroup(new FlowPhase({ action: 'ban' })));
	}

	/**
	 * Remove a phase from the selected flow
	 *
	 * @param index index of the phase to remove
	 */
	removePhase(index: number): void {
		this.phases.removeAt(index);
	}

	/**
	 * Move a phase up or down in the selected flow
	 *
	 * @param index index of the phase to move
	 * @param offset number of positions to move, negative moves up
	 */
	movePhase(index: number, offset: number): void {
		const target = index + offset;

		if (target < 0 || target >= this.phases.length) {
			return;
		}

		const control = this.phases.at(index);

		this.phases.removeAt(index);
		this.phases.insert(target, control);
	}

	/**
	 * Add a default trigger to the selected flow
	 */
	addTrigger(): void {
		this.triggers.push(this.createTriggerGroup(new FlowTrigger({ subject: 'team1', threshold: 3, action: 'ban' })));
	}

	/**
	 * Remove a trigger from the selected flow
	 *
	 * @param index index of the trigger to remove
	 */
	removeTrigger(index: number): void {
		this.triggers.removeAt(index);
	}

	/**
	 * Reset the open-ended setting when a phase is changed to anything other than a pick
	 *
	 * @param phase the phase form group
	 */
	onActionChange(phase: FormGroup): void {
		if (phase.get('action').value !== 'pick') {
			phase.get('untilEnd').setValue(false);
		}
	}

	/**
	 * Get the names of the stages that use a flow
	 *
	 * @param flowKey client key of the flow
	 * @returns the stage names
	 */
	stagesUsingFlow(flowKey: string): string[] {
		return this.tournament?.stages.filter(stage => stage.matchFlowKey === flowKey).map(stage => stage.name) ?? [];
	}

	/**
	 * Create a description based on the phase settings
	 *
	 * @param phase the phase form group
	 */
	describePhase(phase: FormGroup): string {
		const value = phase.value;
		const order = value.order === 'alternate' ? 'alternating turns' : 'first team, then second team';

		if (value.untilEnd) {
			return `${order} - until the match is decided`;
		}

		const amount = value.useStageCount ? 'based on the stage amount' : `${value.countPerTeam}x each`;

		return `${order} - ${amount}`;
	}

	/**
	 * Generates a preview of how the match is supposed to flow with the current settings
	 */
	getPreview(): { steps: PreviewStep[]; open: PreviewStep | null; sample: string } {
		const flow = this.toMatchFlows()[this.selectedIndex];

		if (!flow) {
			return { steps: [], open: null, sample: '' };
		}

		const stage = this.tournament.stages.find(s => s.matchFlowKey === flow.key) ?? this.tournament.stages[0];
		const counts = stage ? { bans: stage.bans, protects: stage.protects } : { bans: 2, protects: 1 };
		const procedure = MatchFlowEngine.compile(flow, this.previewFirstTeam, counts);

		return {
			steps: procedure.steps.map(step => ({ action: step.action, team: MatchFlowEngine.resolveTeam(procedure, step) })),
			open: procedure.openPhase ? { action: procedure.openPhase.action, team: this.previewFirstTeam } : null,
			sample: stage ? `${stage.name}: ${counts.bans} ban(s), ${counts.protects} protect(s)` : `${counts.bans} ban(s), ${counts.protects} protect(s)`
		};
	}

	private toMatchFlows(): MatchFlow[] {
		return this.flows.getRawValue().map(flow => new MatchFlow({
			id: flow.id,
			key: flow.key,
			name: flow.name,
			description: flow.description,
			phases: flow.phases.map((phase: any) => new FlowPhase({
				action: phase.action,
				order: phase.order,
				useStageCount: phase.useStageCount,
				countPerTeam: phase.untilEnd ? null : Number(phase.countPerTeam)
			})),
			triggers: flow.triggers.map((trigger: any) => new FlowTrigger({
				id: trigger.id,
				key: trigger.key,
				subject: trigger.subject,
				threshold: Number(trigger.threshold),
				repeatEvery: trigger.repeat ? Number(trigger.repeatEvery) : null,
				grantTo: trigger.grantTo,
				action: trigger.action,
				count: Number(trigger.count)
			}))
		}));
	}

	private createFlowGroup(flow: MatchFlow): FormGroup {
		return new FormGroup({
			id: new FormControl(flow.id ?? null),
			key: new FormControl(flow.key),
			name: new FormControl(flow.name ?? '', Validators.required),
			description: new FormControl(flow.description ?? ''),
			phases: new FormArray(flow.phases.map(phase => this.createPhaseGroup(phase))),
			triggers: new FormArray(flow.triggers.map(trigger => this.createTriggerGroup(trigger)))
		});
	}

	private createPhaseGroup(phase: FlowPhase): FormGroup {
		return new FormGroup({
			action: new FormControl(phase.action),
			order: new FormControl(phase.order),
			useStageCount: new FormControl(phase.useStageCount),
			countPerTeam: new FormControl(phase.countPerTeam ?? 1, [Validators.required, Validators.min(1)]),
			untilEnd: new FormControl(phase.countPerTeam === null)
		});
	}

	private createTriggerGroup(trigger: FlowTrigger): FormGroup {
		return new FormGroup({
			id: new FormControl(trigger.id ?? null),
			key: new FormControl(trigger.key),
			subject: new FormControl(trigger.subject),
			threshold: new FormControl(trigger.threshold ?? 1, [Validators.required, Validators.min(1)]),
			repeat: new FormControl(trigger.repeatEvery != null),
			repeatEvery: new FormControl(trigger.repeatEvery ?? trigger.threshold ?? 1, [Validators.required, Validators.min(1)]),
			grantTo: new FormControl(trigger.grantTo),
			action: new FormControl(trigger.action),
			count: new FormControl(trigger.count, [Validators.required, Validators.min(1)])
		});
	}
}
