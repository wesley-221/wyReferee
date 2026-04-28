import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteTournamentDialogComponent } from 'app/components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { BehaviorSubject, map } from 'rxjs';
import { TournamentFilter } from '../../models/tournament-filter';

@Component({
	selector: 'app-administrator-tournaments',
	templateUrl: './administrator-tournaments.component.html',
	styleUrls: ['./administrator-tournaments.component.scss']
})
export class AdministratorTournamentsComponent implements OnInit {
	allTournaments: WyTournament[];
	filteredTournaments: WyTournament[];
	allUsers$: BehaviorSubject<User[]>;

	constructor(
		private tournamentService: TournamentService,
		private toastService: ToastService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.allUsers$ = new BehaviorSubject([]);

		this.allTournaments = [];
		this.filteredTournaments = [];
	}

	ngOnInit(): void {
		this.tournamentService.getAllPublishedTournamentsWithGlobalAdminPermissions()
			.pipe(
				map(this.tournamentService.processTournamentsForFilters)
			)
			.subscribe(({ tournaments, users }) => {
				this.allTournaments = tournaments;
				this.filteredTournaments = tournaments;
				this.allUsers$.next(users);
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

	/**
	 * Filter the tournaments based on the provided filters
	 *
	 * @param filters the filters to apply to the tournaments
	 */
	onFiltersChanged(filters: TournamentFilter) {
		this.filteredTournaments = this.allTournaments.filter(tournament => {
			const matchesSearch = !filters.search || tournament.name.toLowerCase().includes(filters.search.toLowerCase());
			const matchesUser = !filters.username || tournament.createdBy.username.toLowerCase().includes(filters.username.toLowerCase());

			return matchesSearch && matchesUser;
		});
	}
}
