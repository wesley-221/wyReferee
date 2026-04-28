import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/authentication/user';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { BehaviorSubject, map } from 'rxjs';
import { TournamentFilter } from '../../models/tournament-filter';

@Component({
	selector: 'app-import-tournament',
	templateUrl: './import-tournament.component.html',
	styleUrls: ['./import-tournament.component.scss']
})
export class ImportTournamentComponent implements OnInit {
	allTournaments: WyTournament[];
	filteredTournaments: WyTournament[];
	allUsers$: BehaviorSubject<User[]>;

	constructor(private tournamentService: TournamentService, private toastService: ToastService) {
		this.allUsers$ = new BehaviorSubject([]);

		this.allTournaments = [];
		this.filteredTournaments = [];
	}

	ngOnInit(): void {
		this.tournamentService.getAllPublishedTournaments()
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
