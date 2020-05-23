import { Component, OnInit, Input } from '@angular/core';
import { Tournament } from '../../../models/tournament/tournament';
import { Router } from '@angular/router';
import { TournamentService } from '../../../services/tournament.service';
import { ToastService } from '../../../services/toast.service';
import { AuthenticateService } from '../../../services/authenticate.service';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-tournament-summary',
	templateUrl: './tournament-summary.component.html',
	styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent implements OnInit {
	@Input() tournament: Tournament;
	@Input() publish: boolean = false;

	constructor(private router: Router, private tournamentService: TournamentService, private toastService: ToastService, private authService: AuthenticateService) { }

	ngOnInit(): void { }

	/**
	 * Update a mappool
	 * @param mappool the mappool to update
	 */
	updateTournament(tournament: Tournament) {
		this.tournamentService.getPublishedTournament(tournament.publishId).subscribe((data) => {
			const updatedTournament: Tournament = this.tournamentService.mapFromJson(data);
			updatedTournament.id = tournament.id;
			updatedTournament.updateAvailable = false;

			this.tournamentService.replaceTournament(tournament, updatedTournament);

			this.toastService.addToast(`Successfully updated the tournament "${tournament.tournamentName}"!`, ToastType.Information);
		});
	}

	/**
	 * Edit a tournament
	 * @param tournament the tournament to edit
	 */
	editTournament(tournament: Tournament, event) {
		// Check if click wasn't on a button
		if(event.srcElement.className.indexOf('btn') == -1) {
			this.router.navigate(['tournament-edit', tournament.id, this.publish]);
		}
	}

	/**
	 * Publish a tournament
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: Tournament) {
		let publishTournament: Tournament = Tournament.makeTrueCopy(tournament);

		// Reset id
		publishTournament.id = null;

		// Stringify the mods
		for(let team in publishTournament.teams) {
			// Reset id
			publishTournament.teams[team].id = null;

			for(let player in publishTournament.teams[team].teamPlayers) {
				// Reset id
				publishTournament.teams[team].teamPlayers[player].id = null;
			}
		}

		if(confirm(`Are you sure you want to publish "${publishTournament.tournamentName}"?`)) {
			this.tournamentService.publishTournament(publishTournament).subscribe((data) => {
				this.toastService.addToast(`Successfully published the tournament "${data.body.tournamentName}" with the id ${data.body.id}.`);
			});
		}
	}

	/**
	 * Check if the user has sufficient permissions to publish the tournament
	 */
	canPublish() {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true || this.authService.loggedInUser.isAdmin);
	}

	/**
	 * Delete a tournament from the bottom of the earth
	 * @param tournament the tournament
	 */
	deleteTournament(tournament: Tournament) {
		if(this.publish == true) {
			if(confirm(`Are you sure you want to delete the tournament "${tournament.tournamentName}"? \nNOTE: No one will be able to import it any longer if you continue.`)) {
				this.tournamentService.deletePublishedTournament(tournament).subscribe(() => {
					this.toastService.addToast(`Successfully deleted the published tournament "${tournament.tournamentName}".`);
				}, (err) => {
					console.log(err);
				});
			}
		}
		else {
			if(confirm(`Are you sure you want to delete the tournament "${tournament.tournamentName}"?`)) {
				this.tournamentService.deleteTournament(tournament);
			}
		}
	}
}
