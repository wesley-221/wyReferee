import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Calculate } from 'app/models/score-calculation/calculate';
import { ScoreInterface } from 'app/models/score-calculation/calculation-types/score-interface';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { IrcService } from 'app/services/irc.service';
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

	constructor(public tournamentService: TournamentService, private ircService: IrcService) {
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

		this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
		this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));

		this.validationForm.addControl('stage', new FormControl('', Validators.required));

		this.lobbyWithBrackets = this.selectedTournament.lobbyTeamNameWithBrackets;

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
}
