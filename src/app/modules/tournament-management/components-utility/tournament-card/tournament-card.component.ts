import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteTournamentDialogComponent } from 'app/components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from 'app/components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ElectronService } from 'app/services/electron.service';
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
	@Output() tournamentPublishedEmitter: EventEmitter<{ tournament: WyTournament; id: number }>;

	constructor(private tournamentService: TournamentService, private dialog: MatDialog, private router: Router, private toastService: ToastService, public electronService: ElectronService) {
		this.deletedTournamentEmitter = new EventEmitter(false);
		this.tournamentPublishedEmitter = new EventEmitter(null);
	}
	ngOnInit(): void { }

	/**
	 * Edit a tournament
	 *
	 * @param tournament the tournament to edit
	 */
	editTournament(tournament: WyTournament, event: any): void {
		// Check if click wasn't on a button
		if (event.toElement.localName == 'div') {
			if (this.publishedTournament == undefined || this.publishedTournament == false) {
				this.router.navigate(['/tournament-management/tournament-overview/tournament-edit', tournament.id, 0]);
			}
			else {
				this.router.navigate(['/tournament-management/tournament-overview/tournament-edit', tournament.id, 1]);
			}
		}
	}

	/**
	 * Delete a mappool from the bottom of the earth
	 *
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
						this.toastService.addToast(`Unable to delete the tournament: ${error.error.message as string}`, ToastType.Error);
					});
				}
			}
		});
	}

	/**
	 * Navigate to the published tournament
	 *
	 * @param tournament the tournament to navigate to
	 */
	goToPublishedTournament(tournament: WyTournament): void {
		this.router.navigate(['tournament-management/tournament-overview/tournament-my-published/tournament-published-edit', tournament.publishId]);
	}

	/**
	 * Publish a tournament
	 *
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
					this.tournamentPublishedEmitter.next({
						id: tournament.id,
						tournament: data
					});

					this.toastService.addToast(`Successfully published the tournament "${data.name}" with the id ${data.id}.`);
				});
			}
		});
	}
}
