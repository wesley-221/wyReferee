import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteTournamentDialogComponent } from 'app/components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
	selector: 'app-tournament-all-published-administrator',
	templateUrl: './tournament-all-published-administrator.component.html',
	styleUrls: ['./tournament-all-published-administrator.component.scss']
})
export class TournamentAllPublishedAdministratorComponent implements OnInit {
	allTournaments: WyTournament[];
	allUsers: User[];

	searchValue: string;
	filterByUser: string;

	filterByUserFormControl = new FormControl();
	filteredUsers: Observable<User[]>;

	usersImported$: BehaviorSubject<boolean>;

	constructor(private tournamentService: TournamentService, private toastService: ToastService, private router: Router, private dialog: MatDialog) {
		this.usersImported$ = new BehaviorSubject(false);

		this.allTournaments = [];
		this.allUsers = [];

		this.searchValue = '';
		this.filterByUser = '';

		this.tournamentService.getAllPublishedTournamentsWithGlobalAdminPermissions().subscribe(tournaments => {
			for (const tournament of tournaments) {
				const newTournament = WyTournament.makeTrueCopy(tournament);

				this.allTournaments.push(WyTournament.makeTrueCopy(tournament));

				if (!this.allUsers.find(user => user.id == newTournament.createdBy.id)) {
					this.allUsers.push(newTournament.createdBy);
				}
			}

			this.allTournaments.reverse();
			this.allUsers.sort((a: User, b: User) => a.username.localeCompare(b.username));
			this.usersImported$.next(true);
		});
	}

	ngOnInit(): void {
		this.usersImported$.subscribe(res => {
			if (res == true) {
				this.filteredUsers = this.filterByUserFormControl.valueChanges.pipe(
					startWith(''),
					map(value => this.filter(value))
				);
			}
		});
	}

	/**
	 * Edit a tournament from the entered tournament id
	 */
	editTournament(tournament: WyTournament) {
		this.router.navigate(['/tournament-management/tournament-overview/tournament-edit/', tournament.id, '1']);
	}

	/**
	 * Import a tournament from the entered tournament id
	 */
	importTournament(tournament: WyTournament) {
		this.tournamentService.getPublishedTournament(tournament.id).subscribe((data) => {
			const newTournament: WyTournament = WyTournament.makeTrueCopy(data);
			newTournament.publishId = newTournament.id;
			newTournament.id = this.tournamentService.availableTournamentId++;

			this.tournamentService.saveTournament(newTournament);
			this.toastService.addToast(`Imported the tournament "${newTournament.name}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the tournament with the id "${tournament.id}".`, ToastType.Error);
		});
	}

	/**
	 * Delete a tournament
	 *
	 * @param tournament the tournament to delete
	 */
	deleteTournament(tournament: WyTournament) {
		const dialogRef = this.dialog.open(DeleteTournamentDialogComponent, {
			data: {
				tournament: tournament
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.tournamentService.deletePublishedTournament(tournament).subscribe(() => {
					this.allTournaments.splice(this.allTournaments.indexOf(tournament), 1);

					this.toastService.addToast('Successfully deleted the tournament.');
				}, error => {
					this.toastService.addToast(`Unable to delete the tournament: ${error.error.message as string}`, ToastType.Error);
				});
			}
		});
	}

	private filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
