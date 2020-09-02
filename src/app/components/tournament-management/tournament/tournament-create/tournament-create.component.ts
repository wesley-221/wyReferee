import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../models/tournament/tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})

export class TournamentCreateComponent implements OnInit {
	tournamentCreate: Tournament;
	validationForm: FormGroup;

	constructor(private tournamentService: TournamentService, private toastService: ToastService) {
		this.tournamentCreate = new Tournament();

		this.validationForm = new FormGroup({
			'tournament-name': new FormControl('', [
				Validators.required
			]),
			'tournament-acronym': new FormControl('', [
				Validators.required
			]),
			'tournament-score-system': new FormControl('', [
				Validators.required
			]),
			'tournament-team-size': new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(8)
			]),
			'tournament-format': new FormControl('', [
				Validators.required
			])
		});
	}

	ngOnInit() { }

	/**
	 * Create the tournament
	 */
	createTournament() {
		if (this.validationForm.valid) {
			this.tournamentService.saveTournament(this.tournamentCreate);
			this.toastService.addToast(`Successfully created the tournament "${this.tournamentCreate.tournamentName}" with a total of ${this.tournamentCreate.getTeams().length} team(s).`);

			this.tournamentCreate = new Tournament();
		}
		else {
			this.toastService.addToast(`The tournament wasn't filled in correctly. Look for the marked fields to see what you did wrong.`, ToastType.Warning);
			this.validationForm.markAllAsTouched();
		}
	}
}
