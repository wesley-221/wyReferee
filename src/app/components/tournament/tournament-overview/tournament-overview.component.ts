import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../../services/authenticate.service';
import { Tournament } from '../../../models/tournament/tournament';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})

export class TournamentOverviewComponent implements OnInit {
	tournamentId: number;

	constructor(public tournamentService: TournamentService, private toastService: ToastService, private router: Router, private authService: AuthenticateService) { }

	ngOnInit() { }

	importTeam() {
		this.tournamentService.getPublishedTournament(this.tournamentId).subscribe((data) => {
			const newTournament: Tournament = this.tournamentService.mapFromJson(data);

			this.tournamentService.addTournament(newTournament);
			this.toastService.addToast(`Imported the tournament "${newTournament.tournamentName}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the tournament with the id "${this.tournamentId}".`, ToastType.Error);
		});
	}

	deleteTournament(tournament: Tournament) {
		if(confirm(`Are you sure you want to delete the tournament "${tournament.tournamentName}"?`)) {
			this.tournamentService.removeTournament(tournament);
			this.toastService.addToast(`Successfully deleted the tournament "${tournament.tournamentName}".`);
		}
	}

	editTournament(tournament: Tournament) {
		console.log(tournament.tournamentId)
		this.router.navigate(['tournament-edit', tournament.tournamentId]);
	}

	canPublish() {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true);
	}

	/**
	 * Publish a tournament
	 * @param mappool the mappool to publish
	 */
	publishTournament(tournament: Tournament) {
		if(confirm(`Are you sure you want to publish "${tournament.tournamentName}"?`)) {
			this.tournamentService.publishTournament(tournament).subscribe((data) => {
				this.toastService.addToast(`Successfully published the tournament "${data.body.tournamentName}" with the id ${data.body.id}.`);
			});
		}
	}
}
