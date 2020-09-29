import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../../../models/tournament/tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})

export class TournamentEditComponent implements OnInit {
	publish: any;
	tournament: Tournament;
	validationForm: FormGroup;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private toastService: ToastService) {
		this.route.params.subscribe(params => {
			this.publish = params.publish;

			if (this.publish == true || this.publish == 'true') {
				this.tournamentService.getPublishedTournament(params.tournamentId).subscribe(data => {
					this.tournament = Tournament.serializeJson(data);

					// Collapse all teams
					for (const team in this.tournament.teams) {
						this.tournament.teams[team].collapsed = true;
					}

					this.validationForm = new FormGroup({
						'tournament-name': new FormControl(this.tournament.tournamentName, [
							Validators.required
						]),
						'tournament-acronym': new FormControl(this.tournament.acronym, [
							Validators.required
						]),
						'tournament-score-system': new FormControl(this.tournament.tournamentScoreInterfaceIdentifier, [
							Validators.required
						]),
						'tournament-team-size': new FormControl(this.tournament.teamSize, [
							Validators.required,
							Validators.min(1),
							Validators.max(8)
						]),
						'tournament-format': new FormControl(this.tournament.format, [
							Validators.required
						]),
						'challonge-integration': new FormControl(this.tournament.challongeIntegration, [
							Validators.required
						])
					});

					let validateIndex = 0;

					for (const team of this.tournament.teams) {
						this.validationForm.addControl(`tournament-team-name-${validateIndex}`, new FormControl(team.teamName, Validators.required))
						team.validateIndex = validateIndex++;
					}
				});
			}
			else {
				this.tournament = Tournament.makeTrueCopy(tournamentService.getTournament(params.tournamentId));

				// Collapse all teams
				for (const team in this.tournament.teams) {
					this.tournament.teams[team].collapsed = true;
				}

				this.validationForm = new FormGroup({
					'tournament-name': new FormControl(this.tournament.tournamentName, [
						Validators.required
					]),
					'tournament-acronym': new FormControl(this.tournament.acronym, [
						Validators.required
					]),
					'tournament-score-system': new FormControl(this.tournament.tournamentScoreInterfaceIdentifier, [
						Validators.required
					]),
					'tournament-team-size': new FormControl(this.tournament.teamSize, [
						Validators.required,
						Validators.min(1),
						Validators.max(8)
					]),
					'tournament-format': new FormControl(this.tournament.format, [
						Validators.required
					]),
					'challonge-integration': new FormControl(this.tournament.challongeIntegration, [
						Validators.required
					])
				});

				let validateIndex = 0;

				for (const team of this.tournament.teams) {
					this.validationForm.addControl(`tournament-team-name-${validateIndex}`, new FormControl(team.teamName, Validators.required))
					team.validateIndex = validateIndex++;
				}
			}
		});
	}

	ngOnInit() { }

	/**
	 * Create the tournament
	 */
	udpateTournament(tournament: Tournament): void {
		if (this.validationForm.valid) {
			if (this.publish == true || this.publish == 'true') {
				this.tournamentService.updatePublishedTournament(tournament).subscribe(() => {
					this.toastService.addToast(`Successfully updated the tournament "${tournament.tournamentName}".`);
				});
			}
			else {
				this.tournamentService.updateTournament(this.tournament);
				this.toastService.addToast(`Successfully updated the tournament "${tournament.tournamentName}".`);
			}
		}
		else {
			this.toastService.addToast('The tournament wasn\'t filled in correctly. Look for the marked fields to see what you did wrong.', ToastType.Warning);
			this.validationForm.markAllAsTouched();
		}
	}
}
