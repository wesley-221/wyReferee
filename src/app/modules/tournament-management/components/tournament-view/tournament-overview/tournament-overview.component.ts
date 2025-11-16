import { Component, OnInit } from '@angular/core';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit {
	allTournaments: WyTournament[];
	active: string;

	constructor(public authenticateService: AuthenticateService, private tournamentService: TournamentService) {
		this.allTournaments = this.tournamentService.allTournaments;
		this.active = 'local';
	}

	ngOnInit(): void {
		this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
			if (initialized == true) {
				this.allTournaments = this.tournamentService.allTournaments;
			}
		});
	}

	click(type: string) {
		if (type == 'local') {
			this.active = 'local';
		}
		else if (type == 'published') {
			this.active = 'published';
		}
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
}
