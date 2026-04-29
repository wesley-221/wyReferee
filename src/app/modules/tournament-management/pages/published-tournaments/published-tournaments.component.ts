import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../../services/tournament.service';
import { WyTournament } from '../../../../models/wytournament/wy-tournament';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../../../../models/authentication/user';
import { Router } from '@angular/router';
import { TournamentFilter } from '../../interfaces/tournament-filter';

@Component({
	selector: 'app-published-tournaments',
	templateUrl: './published-tournaments.component.html',
	styleUrl: './published-tournaments.component.scss'
})
export class PublishedTournamentsComponent implements OnInit {
	allTournaments: WyTournament[];
	filteredTournaments: WyTournament[];
	allUsers$: BehaviorSubject<User[]>;

	constructor(
		private tournamentService: TournamentService,
		private router: Router
	) {
		this.allUsers$ = new BehaviorSubject([]);

		this.allTournaments = [];
		this.filteredTournaments = [];
	}

	ngOnInit(): void {
		this.populateTournamentArray();
	}

	onTournamentClick(tournament: WyTournament, event: any) {
		if (event.target.localName == 'div') {
			this.router.navigate(['/tournament-management/tournament-edit/', '1', tournament.id]);
		}
	}

	/**
	 * Populate the tournaments array
	 */
	private populateTournamentArray(): void {
		this.allTournaments = [];
		this.filteredTournaments = [];

		this.tournamentService.getAllPublishedTournamentsWithAdminPermissions()
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
	 * Repopulate the tournament array when a tournament gets deleted
	 *
	 * @param deleted if the tournament is deleted
	 */
	onTournamentDeleted(deleted: boolean) {
		if (deleted == true) {
			this.populateTournamentArray();
		}
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
