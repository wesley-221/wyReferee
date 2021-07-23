import { Component, OnInit } from '@angular/core';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { TournamentService } from 'app/services/tournament.service';

export interface ITournamentDialogData {
	tournament: WyTournament;
}

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit {
	allTournaments: WyTournament[];

	constructor(private tournamentService: TournamentService) {
		this.allTournaments = this.tournamentService.allTournaments;
	}
	ngOnInit(): void { }
}
