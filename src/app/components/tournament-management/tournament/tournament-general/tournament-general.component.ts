import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Calculate } from 'app/models/score-calculation/calculate';
import { TournamentFormat, WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-general',
	templateUrl: './tournament-general.component.html',
	styleUrls: ['./tournament-general.component.scss']
})
export class TournamentGeneralComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	calculateScoreInterfaces: Calculate;

	constructor() {
		this.calculateScoreInterfaces = new Calculate();
	}
	ngOnInit(): void { }

	/**
	 * Change the score interface
	 */
	changeScoreInterface(event: MatSelectChange): void {
		const selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.validationForm.get('tournament-team-size').setValue(selectedScoreInterface.getTeamSize());
		this.validationForm.get('tournament-format').setValue((selectedScoreInterface.isSoloTournament() != null && selectedScoreInterface.isSoloTournament() == true ? TournamentFormat.Solo : TournamentFormat.Teams));

		this.tournament.scoreInterface = selectedScoreInterface;
		this.tournament.scoreInterfaceIdentifier = selectedScoreInterface.getIdentifier();
	}
}
