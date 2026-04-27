import { Component } from '@angular/core';
import { WyTournament } from '../../../../models/wytournament/wy-tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-local-tournaments',
	templateUrl: './local-tournaments.component.html',
	styleUrl: './local-tournaments.component.scss'
})
export class LocalTournamentsComponent {
	allTournaments: WyTournament[];

	constructor(
		private tournamentService: TournamentService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
			if (initialized == true) {
				this.allTournaments = this.tournamentService.allTournaments;
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

	onTournamentClick(tournament: WyTournament) {
		this.router.navigate(['/tournament-management/local-tournaments/', tournament.id, '0']);
	}
}
