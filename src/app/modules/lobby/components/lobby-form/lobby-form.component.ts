import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Calculate } from 'app/models/score-calculation/calculate';
import { ScoreInterface } from 'app/models/score-calculation/calculation-types/score-interface';
import { ToastType } from 'app/models/toast';
import { WyBinMatch } from 'app/models/wybintournament/wybin-match';
import { WyBinStage } from 'app/models/wybintournament/wybin-stage';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { IrcService } from 'app/services/irc.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
	selector: 'app-lobby-form',
	templateUrl: './lobby-form.component.html',
	styleUrls: ['./lobby-form.component.scss']
})
export class LobbyFormComponent implements OnInit {
	@Input() isJoinLobbyForm: boolean;
	@Input() validationForm: FormGroup;

	selectedTournament: WyTournament;
	teamSize: number;
	selectedScoreInterface: ScoreInterface;
	calculateScoreInterfaces: Calculate;

	qualifier: boolean;
	qualifierLobbyIdentifier: string;
	lobbyWithBrackets: boolean;
	webhook: boolean;

	teamOneFilter: Observable<WyTeam[]>;
	teamTwoFilter: Observable<WyTeam[]>;

	teamOneArray: number[];
	teamTwoArray: number[];

	ircAuthenticated: boolean;

	wyBinStages: WyBinStage[];
	wyBinMatches: WyBinMatch[];
	validatorWyBinMatchList: string[];

	wyBinMatchesFilter: Observable<WyBinMatch[]>;

	loadingWyBinStages: boolean;

	customMatch: boolean;

	constructor(public tournamentService: TournamentService, private ircService: IrcService, private toastService: ToastService) {
		this.isJoinLobbyForm = false;

		this.teamOneArray = [];
		this.teamTwoArray = [];

		this.ircAuthenticated = false;

		this.ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			this.ircAuthenticated = isAuthenticated;
		});

		this.calculateScoreInterfaces = new Calculate();

		this.qualifier = false;
		this.webhook = true;
		this.customMatch = false;

		this.wyBinStages = [];
		this.wyBinMatches = [];
		this.validatorWyBinMatchList = [];

		this.loadingWyBinStages = false;
	}

	ngOnInit(): void { }

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}

	changeTournament() {
		this.selectedTournament = this.tournamentService.getTournamentById(this.validationForm.get('selected-tournament').value);

		this.changeTeamSize(this.selectedTournament != null ? this.selectedTournament.teamSize : null);

		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.selectedTournament ? this.selectedTournament.scoreInterfaceIdentifier : null);
		this.teamSize = this.selectedScoreInterface ? this.selectedScoreInterface.getTeamSize() : null;
		this.validationForm.get('team-size').setValue(this.selectedTournament != null ? this.selectedTournament.teamSize : this.teamSize);
		this.validationForm.get('tournament-acronym').setValue(this.selectedTournament != null ? this.selectedTournament.acronym : null);
		this.validationForm.get('score-interface').setValue(this.selectedScoreInterface ? this.selectedScoreInterface.getIdentifier() : null);

		this.validationForm.addControl('stage', new FormControl('', Validators.required));

		this.lobbyWithBrackets = this.selectedTournament.lobbyTeamNameWithBrackets;

		if (this.selectedTournament.hasWyBinConnected()) {
			this.wyBinStages = [];
			this.loadingWyBinStages = true;

			this.tournamentService.getWyBinStages(this.selectedTournament.wyBinTournamentId).subscribe(stages => {
				for (const stage of stages) {
					this.wyBinStages.push(WyBinStage.makeTrueCopy(stage));
				}

				for (const wyRefereeStage of this.selectedTournament.stages) {
					let stageFound = false;

					for (const wyBinStage of this.wyBinStages) {
						if (wyRefereeStage.name.toLowerCase() == wyBinStage.name.toLowerCase()) {
							stageFound = true;
							break;
						}
					}

					// A wyReferee was not found in the wyBin stages, add it to the list
					if (stageFound == false) {
						this.wyBinStages.push(new WyBinStage({
							wyRefereeId: parseInt(wyRefereeStage.id),
							name: wyRefereeStage.name
						}));
					}
				}

				this.loadingWyBinStages = false;
			}, (error: HttpErrorResponse) => {
				this.loadingWyBinStages = false;

				this.toastService.addToast(error.error.message, ToastType.Error);
			});

			this.validationForm.setControl('stage', new FormControl(''));
			this.validationForm.addControl('stage-id', new FormControl('', Validators.required));

			this.validationForm.addControl('selected-match-name', new FormControl(''));
			this.validationForm.addControl('selected-match-id', new FormControl(''));

			this.validationForm.setControl('team-one-name', new FormControl(''));
			this.validationForm.setControl('team-two-name', new FormControl(''));
		}
		else {
			this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
			this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));
		}

		this.initializeFilters();
	}

	changeTeamSize(teamSize?: number) {
		this.teamOneArray = [];
		this.teamTwoArray = [];

		let teamSizeVal: any;

		if (teamSize == null || teamSize == undefined) {
			teamSizeVal = parseInt(this.getValidation('team-size').value >= 8 ? 8 : this.getValidation('team-size').value);
		}
		else {
			teamSizeVal = teamSize >= 8 ? 8 : teamSize;
		}

		teamSizeVal = parseInt(teamSizeVal);

		for (let i = 1; i < (teamSizeVal + 1); i++) {
			this.teamOneArray.push(i);
		}

		for (let i = teamSizeVal + 1; i < ((teamSizeVal * 2) + 1); i++) {
			this.teamTwoArray.push(i);
		}
	}

	changeScoreInterface(event: MatSelectChange) {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.teamSize = this.selectedScoreInterface.getTeamSize();
		this.validationForm.get('team-size').setValue(this.teamSize);
	}

	changeStage() {
		const stageId = this.validationForm.get('stage-id').value;

		this.wyBinMatches = [];

		if (this.customMatch == false) {
			this.validationForm.get('selected-match-id').setValue(null);
			this.validationForm.get('selected-match-name').setValue(null);
		}

		const stage = this.wyBinStages.find(stage => stage.wyRefereeId == stageId || stage.id == stageId);

		if (stage) {
			this.wyBinMatches = stage.matches || [];
			this.validationForm.get('stage').setValue(stage.name);
		}

		this.initializeMatchFilter();
	}

	selectMatch(option: MatAutocompleteSelectedEvent) {
		for (const match of this.wyBinMatches) {
			if (match.getMatchName() == option.option.value) {
				this.validationForm.get('selected-match-id').setValue(match.id);

				if (this.qualifier == false) {
					this.validationForm.get('team-one-name').setValue(match.opponentOne.name);
					this.validationForm.get('team-two-name').setValue(match.opponentTwo.name);
				}
				else {
					this.validationForm.get('qualifier-lobby-identifier').setValue(match.qualifierIdentifier);
				}
			}
		}
	}

	changeQualifierLobby(): void {
		if (this.qualifier == true) {
			this.validationForm.addControl('qualifier-lobby-identifier', new FormControl('', Validators.required));
			this.validationForm.removeControl('team-one-name');
			this.validationForm.removeControl('team-two-name');

			this.validationForm.controls['qualifier-lobby-identifier'].valueChanges.subscribe(value => {
				this.qualifierLobbyIdentifier = value;
			});
		}
		else {
			this.validationForm.removeControl('qualifier-lobby-identifier');
			this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
			this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));
		}
	}

	changeCustomMatch() {
		this.validationForm.get('custom-match').setValue(this.customMatch);

		if (this.customMatch == true) {
			this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
			this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));

			this.validationForm.removeControl('selected-match-name');
			this.validationForm.removeControl('selected-match-id');
		}
		else {
			this.validationForm.removeControl('team-one-name');
			this.validationForm.removeControl('team-two-name');

			this.initializeMatchFilter();
		}
	}

	getVariables() {
		return {
			selectedTournament: this.selectedTournament,
			qualifier: this.qualifier,
			qualifierLobbyIdentifier: this.qualifierLobbyIdentifier,
			lobbyWithBrackets: this.lobbyWithBrackets,
			webhook: this.webhook
		};
	}

	private initializeFilters() {
		this.teamOneFilter = this.validationForm.get('team-one-name').valueChanges.pipe(
			startWith(''),
			map((value: string) => {
				const filterValue = value.toLowerCase();
				return this.selectedTournament.teams.filter(option => option.name.toLowerCase().includes(filterValue));
			})
		);

		this.teamTwoFilter = this.validationForm.get('team-two-name').valueChanges.pipe(
			startWith(''),
			map((value: string) => {
				const filterValue = value.toLowerCase();
				return this.selectedTournament.teams.filter(option => option.name.toLowerCase().includes(filterValue));
			})
		);
	}

	private initializeMatchFilter() {
		this.validatorWyBinMatchList = [];

		for (const match of this.wyBinMatches) {
			this.validatorWyBinMatchList.push(match.getMatchName());
		}

		this.validationForm.setControl('selected-match-name', new FormControl('', [(control) => this.matchValidator(control)]));
		this.validationForm.setControl('selected-match-id', new FormControl(''));

		if (this.wyBinMatches.length <= 0) {
			this.wyBinMatchesFilter = new Observable();
		}
		else {
			this.wyBinMatchesFilter = this.validationForm.get('selected-match-name').valueChanges.pipe(
				startWith(''),
				map((value: string) => value ?? ''),
				map((value: string) => {
					const filterValue = value.toLowerCase();
					return this.wyBinMatches.filter(match => match.getMatchName().toLowerCase().includes(filterValue));
				})
			);
		}
	}

	private matchValidator(control: AbstractControl): ValidationErrors | null {
		return this.validatorWyBinMatchList.includes(control.value) ? null : { invalidMatch: true };
	}
}
