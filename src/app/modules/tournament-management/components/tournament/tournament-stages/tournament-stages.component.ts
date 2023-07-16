import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Calculate } from 'app/models/score-calculation/calculate';
import { CTMCalculation } from 'app/models/score-calculation/calculation-types/ctm-calculation';
import { WyStage } from 'app/models/wytournament/wy-stage';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-tournament-stages',
	templateUrl: './tournament-stages.component.html',
	styleUrls: ['./tournament-stages.component.scss']
})
export class TournamentStagesComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	importingFromWyBin: boolean;

	readonly CTM_SCORE_IDENTIFIER: string;

	constructor(private wybinService: WybinService, private toastService: ToastService) {
		const calculate = new Calculate();
		this.importingFromWyBin = false;

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
	addStage(addStage?: WyStage): void {
		let newStage: WyStage;

		if (addStage) {
			newStage = addStage;
		}
		else {
			newStage = new WyStage();

			newStage.index = this.tournament.stageIndex;
			this.tournament.stageIndex++;
		}

		this.tournament.stages.push(newStage);

		this.validationForm.addControl(`tournament-stage-name-${newStage.index}`, new FormControl(newStage.name, Validators.required));
		this.validationForm.addControl(`tournament-stage-best-of-${newStage.index}`, new FormControl(newStage.bestOf, Validators.required));

		if (this.tournament.scoreInterface instanceof CTMCalculation) {
			this.validationForm.addControl(`tournament-stage-hitpoints-${newStage.index}`, new FormControl('', Validators.required));
		}
	}

	/**
	 * Import the stages from wyBin
	 */
	importWyBinStages() {
		this.importingFromWyBin = true;

		this.wybinService.importStages(this.tournament.wyBinTournamentId).subscribe((stages: any[]) => {
			stages.sort((a, b) => a.startDate - b.startDate);

			for (const stage of stages) {
				const newStage = WyStage.parseFromWyBin(stage);

				newStage.index = this.tournament.stageIndex;
				this.tournament.stageIndex++;

				this.addStage(newStage);
			}

			this.importingFromWyBin = false;
		}, (error: HttpErrorResponse) => {
			this.toastService.addToast(error.error.message);

			this.importingFromWyBin = false;
		});
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
