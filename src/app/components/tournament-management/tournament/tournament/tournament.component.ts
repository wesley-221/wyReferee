import { Component, OnInit, Input } from '@angular/core';
import { Calculate } from '../../../../models/score-calculation/calculate';
import { Tournament, TournamentFormat } from '../../../../models/tournament/tournament';
import { Team } from '../../../../models/tournament/team/team';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

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

	constructor(private toastService: ToastService) {
		this.calculateScoreInterfaces = new Calculate();
	}

	ngOnInit() { }

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
}
