import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Calculate } from 'app/models/score-calculation/calculate';
import { CTMCalculation } from 'app/models/score-calculation/calculation-types/ctm-calculation';
import { WyStage } from 'app/models/wytournament/wy-stage';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-stages',
	templateUrl: './tournament-stages.component.html',
	styleUrls: ['./tournament-stages.component.scss']
})
export class TournamentStagesComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	readonly CTM_SCORE_IDENTIFIER: string;

	constructor() {
		const calculate = new Calculate();

		for (const scoreInterface of calculate.getAllScoreInterfaces()) {
			if (scoreInterface instanceof CTMCalculation) {
				this.CTM_SCORE_IDENTIFIER = scoreInterface.getIdentifier();
				break;
			}
		}
	}

	ngOnInit(): void { }

	/**
	 * Add a stage to the tournament
	 */
	addStage(): void {
		const newStage = new WyStage();

		newStage.index = this.tournament.stageIndex;
		this.tournament.stageIndex++;

		this.tournament.stages.push(newStage);

		this.validationForm.addControl(`tournament-stage-name-${newStage.index}`, new FormControl('', Validators.required));
		this.validationForm.addControl(`tournament-stage-best-of-${newStage.index}`, new FormControl('', Validators.required));

		if (this.tournament.scoreInterface instanceof CTMCalculation) {
			this.validationForm.addControl(`tournament-stage-hitpoints-${newStage.index}`, new FormControl('', Validators.required));
		}
	}

	/**
	 * Change the name of the stage
	 *
	 * @param stage the stage to change the name of
	 * @param event the changed value
	 */
	changeStageName(stage: WyStage, event: any) {
		stage.name = event.target.value;
	}

	/**
	 * Change the starting amount of hitpoints of the stage
	 *
	 * @param stage the stage to change the starting amount of hitpoints of
	 * @param event the changed value
	 */
	changeStageHitpoints(stage: WyStage, event: any) {
		stage.hitpoints = event.target.value;
	}

	/**
	 * Change the best of for the stage
	 *
	 * @param stage the stage to change the best of
	 * @param event the changed value
	 */
	changeStageBestOf(stage: WyStage, event: any) {
		stage.bestOf = event.value;
	}

	/**
	 * Remove a stage from the tournament
	 *
	 * @param stage the stage to remove
	 */
	removeStage(stage: WyStage) {
		this.validationForm.removeControl(`tournament-stage-name-${stage.index}`);
		this.validationForm.removeControl(`tournament-stage-best-of-${stage.index}`);

		if (this.tournament.scoreInterface instanceof CTMCalculation) {
			this.validationForm.removeControl(`tournament-stage-hitpoints-${stage.index}`);
		}

		this.tournament.stages.splice(this.tournament.stages.indexOf(stage), 1);
	}
}
