import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteTournamentDialogComponent } from 'app/components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from 'app/components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-card',
	templateUrl: './tournament-card.component.html',
	styleUrls: ['./tournament-card.component.scss']
})
export class TournamentCardComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() publishedTournament: boolean;
	@Output() deletedTournamentEmitter: EventEmitter<boolean>;

	constructor(private tournamentService: TournamentService, private authService: AuthenticateService, private dialog: MatDialog, private router: Router, private toastService: ToastService) {
		this.deletedTournamentEmitter = new EventEmitter(false);
	}
	ngOnInit(): void { }

	/**
	 * Check if the user has sufficient permissions to publish the mappool
	 */
	canPublish(): boolean {
		return this.authService.loggedIn && (this.authService.loggedInUser.isTournamentManager == true || this.authService.loggedInUser.isAdmin == true);
	}

	/**
	 * Edit a tournament
	 * @param tournament the tournament to edit
	 */
	editTournament(tournament: WyTournament, event: any): void {
		// Check if click wasn't on a button
		if (event.toElement.localName == 'div') {
			if (this.publishedTournament == undefined || this.publishedTournament == false) {
				this.router.navigate(['/tournament-management/tournament-overview/tournament-edit', tournament.id]);
			}
			else {
				this.router.navigate(['/tournament-management/tournament-overview/tournament-my-published/tournament-published-edit', tournament.id]);
			}
		}
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
				if (this.publishedTournament == undefined || this.publishedTournament == false) {
					this.tournamentService.deleteTournament(tournament);
					this.toastService.addToast(`Successfully deleted the mappool "${tournament.name}".`);
				}
				else {
					this.tournamentService.deletePublishedTournament(tournament).subscribe(() => {
						this.deletedTournamentEmitter.emit(true);

						this.toastService.addToast('Successfully deleted the tournament.');
					}, error => {
						this.toastService.addToast(`Unable to delete the tournament: ${error.error.message}`, ToastType.Error);
					});
				}
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
				publishTournament.resetAllIds();

				this.tournamentService.publishTournament(publishTournament).subscribe((data: WyTournament) => {
					this.toastService.addToast(`Successfully published the tournament "${data.name}" with the id ${data.id}.`);
				});
			}
		});
	}
}
