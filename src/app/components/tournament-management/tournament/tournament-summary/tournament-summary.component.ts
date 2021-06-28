import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tournament } from '../../../../models/tournament/tournament';
import { Router } from '@angular/router';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { ToastType } from '../../../../models/toast';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTournamentComponent } from 'app/components/dialogs/delete-tournament/delete-tournament.component';
import { PublishTournamentComponent } from 'app/components/dialogs/publish-tournament/publish-tournament.component';

export interface DeleteTournamentDialogData {
	tournament: Tournament;
}

export interface PublishTournamentDialogData {
	tournament: Tournament;
}

@Component({
	selector: 'app-tournament-summary',
	templateUrl: './tournament-summary.component.html',
	styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent implements OnInit {
	@Input() tournament: Tournament;
	@Input() publish = false;
	@Output() onTournamentDeleted: EventEmitter<Boolean>;

	dialogMessage: string;
	dialogAction = 0;
	tournamentToModify: Tournament;

	constructor(private router: Router, private tournamentService: TournamentService, private toastService: ToastService, private authService: AuthenticateService, private dialog: MatDialog) {
		this.onTournamentDeleted = new EventEmitter();
	}

	ngOnInit(): void { }

	/**
	 * Update a mappool
	 * @param mappool the mappool to update
	 */
	updateTournament(tournament: Tournament): void {
		this.tournamentService.getPublishedTournament(tournament.publishId).subscribe((data) => {
			const updatedTournament: Tournament = Tournament.serializeJson(data);
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
	editTournament(tournament: Tournament, event: any): void {
		// Check if click wasn't on a button
		if (event.srcElement.className.search(/mat-icon|mat-mini-fab|mat-button-wrapper/)) {
			this.router.navigate(['/tournament-management/tournament-overview/tournament-edit', tournament.id, this.publish]);
		}
	}

	/**
	 * Publish a tournament
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: Tournament): void {
		const dialogRef = this.dialog.open(PublishTournamentComponent, {
			data: {
				tournament
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				const publishTournament: Tournament = Tournament.makeTrueCopy(tournament);

				// Reset id
				publishTournament.id = null;

				// Stringify the mods
				for (const team in publishTournament.teams) {
					// Reset id
					publishTournament.teams[team].id = null;

					for (const player in publishTournament.teams[team].teamPlayers) {
						// Reset id
						publishTournament.teams[team].teamPlayers[player].id = null;
					}
				}

				this.tournamentService.publishTournament(publishTournament).subscribe((data: any) => {
					this.toastService.addToast(`Successfully published the tournament "${data.body.tournamentName}" with the id ${data.body.id}.`);
				});
			}
		});
	}

	/**
	 * Check if the user has sufficient permissions to publish the tournament
	 */
	canPublish(): boolean {
		return this.authService.loggedIn && (this.authService.loggedInUser.isTournamentManager == true || this.authService.loggedInUser.isAdmin == true);
	}

	/**
	 * Delete a tournament from the bottom of the earth
	 * @param tournament the tournament
	 */
	deleteTournament(tournament: Tournament): void {
		const dialogRef = this.dialog.open(DeleteTournamentComponent, {
			data: {
				tournament
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				if (this.publish == true) {
					this.tournamentService.deletePublishedTournament(tournament).subscribe(() => {
						this.toastService.addToast(`Successfully deleted the published tournament "${tournament.tournamentName}".`);

						this.onTournamentDeleted.emit(true);
					}, (err) => {
						console.log(err);
					});
				}
				else {
					this.tournamentService.deleteTournament(tournament);
					this.toastService.addToast(`Successfully deleted the published tournament "${tournament.tournamentName}".`);
					this.onTournamentDeleted.emit(true);
				}
			}
		});
	}
}
