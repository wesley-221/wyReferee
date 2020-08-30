import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { Tournament } from '../../../../models/tournament/tournament';
import { ToastType } from '../../../../models/toast';

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})

export class TournamentOverviewComponent implements OnInit {
	tournamentId: number;

	constructor(public tournamentService: TournamentService, private toastService: ToastService, private router: Router, private authService: AuthenticateService) { }

	ngOnInit() { }

	/**
	 * Check if the user has sufficient permissions to publish the tournament
	 */
	canPublish() {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true || this.authService.loggedInUser.isAdmin);
	}

	/**
	 * Import a tournament from the entered tournament id
	 */
	importTournament() {
		this.tournamentService.getPublishedTournament(this.tournamentId).subscribe((data) => {
			const newTournament: Tournament = this.tournamentService.mapFromJson(data);
			newTournament.id = this.tournamentService.availableTournamentId;
			this.tournamentService.availableTournamentId ++;

			this.tournamentService.saveTournament(newTournament);
			this.toastService.addToast(`Imported the tournament "${newTournament.tournamentName}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the tournament with the id "${this.tournamentId}".`, ToastType.Error);
		});
	}
}
