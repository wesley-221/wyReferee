import { Component, OnInit } from '@angular/core';
import { WyTournament } from '../../../../models/wytournament/wy-tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../models/authentication/user';
import { TournamentFilter } from '../../interfaces/tournament-filter';

@Component({
	selector: 'app-local-tournaments',
	templateUrl: './local-tournaments.component.html',
	styleUrl: './local-tournaments.component.scss'
})
export class LocalTournamentsComponent implements OnInit {
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
		this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
			if (initialized == true) {
				const allTournaments = this.tournamentService.allTournaments;
				const processedTournaments = this.tournamentService.processTournamentsForFilters(allTournaments);

				this.allTournaments = processedTournaments.tournaments;
				this.filteredTournaments = processedTournaments.tournaments;
				this.allUsers$.next(processedTournaments.users);
			}
		});
	}

	/**
	 * Updates the local tournament to represent the published tournament and delete the local one from the cache
	 *
	 * @param data the tournament and local id of the tournament
	 */
	onTournamentPublished(data: { tournament: WyTournament; id: number }) {
		if (data != null) {
			data.tournament.publishId = data.tournament.id;
			this.tournamentService.updateTournament(data.tournament, data.id, false);
		}
	}

	onTournamentClick(tournament: WyTournament, event: any) {
		if (event.target.localName == 'div') {
			this.router.navigate(['/tournament-management/tournament-edit/', '0', tournament.id]);
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
