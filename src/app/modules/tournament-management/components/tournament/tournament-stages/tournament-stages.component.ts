import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Calculate } from 'app/models/score-calculation/calculate';
import { CTMCalculation } from 'app/models/score-calculation/calculation-types/ctm-calculation';
import { WyStage } from 'app/models/wytournament/wy-stage';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-stages',
	templateUrl: './tournament-stages.component.html',
	styleUrls: ['./tournament-stages.component.scss']
})
export class TournamentStagesComponent implements OnInit {
	form: FormGroup;
	tournament: WyTournament;

	importingFromWyBin: boolean;

	readonly CTM_SCORE_IDENTIFIER: string;

	constructor(
		private wybinService: WybinService,
		private toastService: ToastService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		const calculate = new Calculate();
		this.importingFromWyBin = false;

		for (const scoreInterface of calculate.getAllScoreInterfaces()) {
			if (scoreInterface instanceof CTMCalculation) {
				this.CTM_SCORE_IDENTIFIER = scoreInterface.getIdentifier();
				break;
			}
		}

		this.form = new FormGroup({
			stages: new FormArray([])
		});
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				this.tournament = tournament;

				if (this.stages.length === 0) {
					const formArray = new FormArray(
						tournament.stages.map(s => this.createStageGroup(s))
					);

					this.form.setControl('stages', formArray, { emitEvent: false });
				}
				else {
					tournament.stages.forEach((cm, i) => {
						this.stages.at(i)?.patchValue(cm, { emitEvent: false });
					});
				}
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateStagesForm(value.stages);
			});
	}

	get stages(): FormArray {
		return this.form.get('stages') as FormArray;
	}

	addStage(addStage?: WyStage): void {
		this.stages.push(this.createStageGroup(addStage));
	}

	importWyBinStages() {
		this.importingFromWyBin = true;

		this.wybinService.importStages(this.tournament.wyBinTournamentId).subscribe({
			next: (stages: any[]) => {
				stages.sort((a, b) => a.startDate - b.startDate);

				for (const stage of stages) {
					const newStage = WyStage.parseFromWyBin(stage);

					this.addStage(newStage);
				}

				this.importingFromWyBin = false;
			},
			error: (error: HttpErrorResponse) => {
				this.toastService.addToast(error.error.message);

				this.importingFromWyBin = false;
			}
		});
	}

	removeStage(index: number): void {
		this.stages.removeAt(index);
	}

	private createStageGroup(stage?: WyStage): FormGroup {
		return new FormGroup({
			name: new FormControl(stage?.name || '', Validators.required),
			bestOf: new FormControl(stage?.bestOf || 0, Validators.required),
			bans: new FormControl(stage?.bans || 0),
			hitpoints: new FormControl(stage?.hitpoints || 0)
		});
	}
}
