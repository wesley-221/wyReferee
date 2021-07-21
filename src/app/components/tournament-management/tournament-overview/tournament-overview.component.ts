import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteTournamentDialogComponent } from 'app/components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from 'app/components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

export interface ITournamentDialogData {
	tournament: WyTournament;
}

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit {
	allTournaments: WyTournament[];

	constructor(private tournamentService: TournamentService, private authService: AuthenticateService, private dialog: MatDialog, private router: Router, private toastService: ToastService) {
		this.allTournaments = this.tournamentService.allTournaments;
	}
	ngOnInit(): void { }

	/**
	 * Edit a tournament
	 * @param tournament the tournament to edit
	 */
	editTournament(tournament: WyTournament, event: any): void {
		// Check if click wasn't on a button
		if (event.toElement.localName == 'div') {
			this.router.navigate(['/tournament-management/tournament-overview/tournament-edit', tournament.id]);
		}
	}

	/**
	 * Check if the user has sufficient permissions to publish the mappool
	 */
	canPublish(): boolean {
		return this.authService.loggedIn && (this.authService.loggedInUser.isTournamentManager == true || this.authService.loggedInUser.isAdmin == true);
	}

	/**
	 * Delete a mappool from the bottom of the earth
	 * @param mappool the mappool
	 */
	deleteTournament(tournament: WyTournament): void {
		const dialogRef = this.dialog.open(DeleteTournamentDialogComponent, {
			data: {
				tournament: tournament
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.tournamentService.deleteTournament(tournament);
				this.toastService.addToast(`Successfully deleted the mappool "${tournament.name}".`);
			}
		});
	}

	/**
	 * Publish a tournament
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: WyTournament): void {
		const dialogRef = this.dialog.open(PublishTournamentDialogComponent, {
			data: {
				tournament
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				const publishTournament: WyTournament = WyTournament.makeTrueCopy(tournament);

				// Reset all ids
				publishTournament.id = null;

				for (const team in publishTournament.teams) {
					publishTournament.teams[team].id = null;

					for (const player in publishTournament.teams[team].players) {
						publishTournament.teams[team].players[player].id = null;
					}
				}

				this.tournamentService.publishTournament(publishTournament).subscribe((data: WyTournament) => {
					this.toastService.addToast(`Successfully published the tournament "${data.name}" with the id ${data.id}.`);
				});
			}
		});
	}
}
