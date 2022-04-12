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
	ngOnInit(): void {
		this.tournament.allowDoublePick = this.validationForm.get('allow-double-pick').value;
		this.tournament.invalidateBeatmaps = this.validationForm.get('invalidate-beatmaps').value;
	}

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

	/**
	 * Change the tournament format (solo or teams)
	 */
	changeTeamFormat(event: MatSelectChange): void {
		this.validationForm.get('tournament-format').setValue(event.value);
		this.tournament.format = event.value;

		if (event.value == 'solo') {
			this.validationForm.get('tournament-team-size').setValue(1);
			this.tournament.teamSize = 1;
		}
	}

	/**
	 * Change the allowed double pick
	 */
	changeAllowDoublePick(event: { source: any; checked: boolean }): void {
		this.validationForm.get('allow-double-pick').setValue(event.checked);
		this.tournament.allowDoublePick = event.checked;
	}

	/**
	 * Change if beatmaps will be invalidated
	 */
	changeInvalidateBeatmaps(event: { source: any; checked: boolean }): void {
		this.validationForm.get('invalidate-beatmaps').setValue(event.checked);
		this.tournament.invalidateBeatmaps = event.checked;
	}
}
