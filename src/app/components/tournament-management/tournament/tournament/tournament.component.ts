import { Component, OnInit, Input } from '@angular/core';
import { Calculate } from '../../../../models/score-calculation/calculate';
import { Tournament, TournamentFormat } from '../../../../models/tournament/tournament';
import { Team } from '../../../../models/tournament/team/team';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ChallongeService } from 'app/services/challonge.service';
import { ElectronService } from 'app/services/electron.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'app/models/authentication/user';
import { AuthenticateService } from 'app/services/authenticate.service';

@Component({
	selector: 'app-tournament',
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
	@Input() tournament: Tournament;
	@Input() validationForm: FormGroup;

	calculateScoreInterfaces: Calculate;

	dialogMessage: string;
	dialogAction = 0;
	teamToRemove: Team;

	validateIndex = 0;

	readonly API_KEY_CORRECT = 1;
	readonly API_KEY_INCORRECT = 2;

	apiKeyValidationProcess = 0;

	allChallongeTournaments: ChallongeTournament[] = [];
	allUsers: User[] = [];
	searchValue: string;

	challongeCreatedMessage: string = null;
	challongeCreatedAlertType: string = null;

	constructor(private toastService: ToastService, private challongeService: ChallongeService, public electronService: ElectronService, private auth: AuthenticateService) {
		this.calculateScoreInterfaces = new Calculate();

		this.auth.getAllUser().subscribe(userArray => {
			for (const item in userArray) {
				const user = User.serializeJson(userArray[item]);
				let foundUser = false;

				for (const i in this.tournament.availableTo) {
					if (user.id == this.tournament.availableTo[i].id) {
						foundUser = true;
					}
				}

				if (foundUser == false)
					this.allUsers.push(user);
			}
		});
	}

	ngOnInit() {
		if (this.tournament.challongeIntegration) {
			this.validationForm.addControl('tournament-challonge-api-key', new FormControl(this.tournament.challongeApiKey, Validators.required));
			this.validationForm.addControl('tournament-challonge-tournament-selected', new FormControl(this.tournament.challongeTournamentId, Validators.required));

			this.validateChallongeApiKey();
		}

		const lastTeam = this.tournament.teams[this.tournament.teams.length - 1];

		if (lastTeam) {
			this.validateIndex = lastTeam.validateIndex;
		}
	}

	/**
	 * Add a team to the tournament
	 */
	addTeam() {
		const newTeam = new Team();
		newTeam.validateIndex = this.validateIndex;
		this.tournament.addTeam(newTeam);

		this.validateIndex++;

		this.validationForm.addControl(`tournament-team-name-${newTeam.validateIndex}`, new FormControl('', Validators.required));
	}

	/**
	 * Add a new user to to tournament
	 */
	addNewUser(user: User): void {
		this.allUsers.splice(this.allUsers.indexOf(user), 1);
		this.tournament.addUser(user);
	}

	/**
	 * Remove a user from the tournament
	 * @param user the user to delete
	 */
	removeUser(user: User): void {
		this.allUsers.push(user);
		this.tournament.removeUser(user);
	}

	/**
	 * Change the score interface
	 * @param event
	 */
	changeScoreInterface(event: MatSelectChange) {
		const selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);
		this.tournament.scoreInterface = selectedScoreInterface;
		this.tournament.teamSize = selectedScoreInterface.getTeamSize();
		this.tournament.format = (selectedScoreInterface.isSoloTournament() != null && selectedScoreInterface.isSoloTournament() == true ? TournamentFormat.Solo : TournamentFormat.Teams);
		this.tournament.tournamentScoreInterfaceIdentifier = selectedScoreInterface.getIdentifier();
	}

	/**
	 * Set the proper tournament format on change
	 * @param event
	 */
	changeTournamentFormat(event: MatSelectChange) {
		this.tournament.format = event.value;

		if (event.value == TournamentFormat.Solo) {
			this.validationForm.get('tournament-team-size').setValue(1);
			this.tournament.teamSize = 1;
		}
	}

	/**
	 * Set the tournament name and acronym on change
	 */
	changeInput() {
		this.tournament.tournamentName = this.validationForm.get('tournament-name').value;
		this.tournament.acronym = this.validationForm.get('tournament-acronym').value;
		this.tournament.teamSize = parseInt(this.validationForm.get('tournament-team-size').value);
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}

	/**
	 * Set itegration enabled to true or false. Adds validations to the form
	 * @param enabled
	 */
	changeChallongeIntegration(enabled: number) {
		if (enabled == 1) {
			this.tournament.challongeIntegration = 1;
			this.validationForm.addControl('tournament-challonge-api-key', new FormControl('', Validators.required));
		}
		else {
			this.tournament.challongeIntegration = 0;
			this.validationForm.removeControl('tournament-challonge-api-key');
		}
	}

	/**
	 * Validate the api key
	 */
	validateChallongeApiKey() {
		const apiKey = this.getValidation('tournament-challonge-api-key').value;

		this.challongeService.validateApiKey(apiKey).subscribe((result) => {
			this.apiKeyValidationProcess = this.API_KEY_CORRECT;
			this.tournament.challongeApiKey = apiKey;

			this.validationForm.addControl('tournament-challonge-tournament-selected', new FormControl('', Validators.required));

			for (const i in result) {
				const tournament: ChallongeTournament = result[i].tournament;

				// Only list tournaments that have been started
				if (tournament.state == "underway") {
					this.allChallongeTournaments.push(tournament);
				}
			}
		}, (error: HttpErrorResponse) => {
			if (error.status == 401) {
				// Invalid key
				this.apiKeyValidationProcess = this.API_KEY_INCORRECT;
				this.tournament.challongeApiKey = null;

				this.validationForm.removeControl('tournament-challonge-tournament-selected');
			}
		})
	}

	/**
	 * Change the current active tournament
	 * @param event
	 */
	changeSelectedChallongeTournament(event: MatSelectChange) {
		for (const tournament of this.allChallongeTournaments) {
			if (tournament.id == event.value) {
				this.tournament.challongeTournamentId = tournament.id;
			}
		}
	}

	/**
	 * Change the challonge creation type
	 * @param creationType 1 for creating new, 2 for existing
	 */
	changeChallongeCreation(creationType: number) {
		this.tournament.challongeCreationType = creationType;

		if (creationType == 1) {
			this.validationForm.addControl('tournament-challonge-name', new FormControl('', Validators.required));
			this.validationForm.addControl('tournament-challonge-url', new FormControl('', Validators.required));
			this.validationForm.addControl('tournament-challonge-type', new FormControl('', Validators.required));
		}
		else if (creationType == 2) {
			this.validationForm.removeControl('tournament-challonge-name');
			this.validationForm.removeControl('tournament-challonge-url');
			this.validationForm.removeControl('tournament-challonge-type');
		}
	}

	/**
	 * Create (attempt to) a tournament through Challonge
	 */
	createChallongeTournament() {
		const apiKey = this.getValidation('tournament-challonge-api-key').value;
		const name = this.getValidation('tournament-challonge-name').value;
		const url = this.getValidation('tournament-challonge-url').value;
		const type = this.getValidation('tournament-challonge-type').value;

		this.challongeService.createTournament(apiKey, name, url, type).subscribe((result: any) => {
			if (result.hasOwnProperty('errors')) {
				this.challongeCreatedAlertType = 'error';

				this.challongeCreatedMessage = '<b>Something went wrong while trying to create the Challonge tournament!</b><ul>';

				for (const error of result.errors) {
					this.challongeCreatedMessage += `<li>${error}</li>`;
				}

				this.challongeCreatedMessage += '</ul>';
			}
			else {
				this.challongeCreatedAlertType = 'success';
				this.challongeCreatedMessage = `Successfully created the Challonge tournament!`;

				const tournament: ChallongeTournament = result.tournament;
				this.validationForm.get('tournament-challonge-tournament-selected').setValue(tournament.id);
				this.tournament.challongeTournamentId = tournament.id;
			}
		})
	}
}
