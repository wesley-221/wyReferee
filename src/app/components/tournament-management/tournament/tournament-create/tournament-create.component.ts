import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../models/tournament/tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';
import { ChallongeService } from 'app/services/challonge.service';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})

export class TournamentCreateComponent implements OnInit {
	tournamentCreate: Tournament;
	validationForm: FormGroup;
	challongeErrorMessage: string;

	constructor(private tournamentService: TournamentService, private toastService: ToastService, private challongeService: ChallongeService) {
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
			]),
			'challonge-integration': new FormControl('', [
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
			if (this.tournamentCreate.challongeIntegration == 1 && this.tournamentCreate.challongeCreationType == 1) {
				let participants = [];

				for (let participant of this.tournamentCreate.teams) {
					participants.push(participant.teamName);
				}

				this.challongeService.bulkAddParticipants(this.tournamentCreate.challongeTournamentId, participants, this.tournamentCreate.challongeApiKey).subscribe((result: any) => {
					if (result.hasOwnProperty('errors')) {
						this.challongeErrorMessage = '<b>Something went wrong while trying to create the Challonge tournament!</b><ul>';

						for (const error of result.errors) {
							this.challongeErrorMessage += `<li>${error}</li>`;
						}

						this.challongeErrorMessage += '</ul>';
					}
					else {
						this.tournamentService.saveTournament(this.tournamentCreate);
						this.toastService.addToast(`Successfully created the tournament "${this.tournamentCreate.tournamentName}" with a total of ${this.tournamentCreate.getTeams().length} team(s).`);
						this.toastService.addToast(`Successfully added ${participants.length} to the Challonge tournament.`);

						this.tournamentCreate = new Tournament();
						this.challongeErrorMessage = null;
					}
				});
			}
			else {
				this.tournamentService.saveTournament(this.tournamentCreate);
				this.toastService.addToast(`Successfully created the tournament "${this.tournamentCreate.tournamentName}" with a total of ${this.tournamentCreate.getTeams().length} team(s).`);

				this.tournamentCreate = new Tournament();
			}
		}
		else {
			this.toastService.addToast('The tournament wasn\'t filled in correctly. Look for the marked fields to see what you did wrong.', ToastType.Warning);
			this.validationForm.markAllAsTouched();
		}
	}
}
