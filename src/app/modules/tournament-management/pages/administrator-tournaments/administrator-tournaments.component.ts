import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/authentication/user';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { TournamentService } from 'app/services/tournament.service';
import { BehaviorSubject, map } from 'rxjs';
import { TournamentFilter } from '../../interfaces/tournament-filter';

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
		private tournamentService: TournamentService
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

	onTournamentDeleted(tournament: WyTournament) {
		this.allTournaments = this.allTournaments.filter(t => t.id !== tournament.id);
		this.filteredTournaments = this.filteredTournaments.filter(t => t.id !== tournament.id);
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
