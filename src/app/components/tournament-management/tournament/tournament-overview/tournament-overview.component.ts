import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../../services/tournament.service';

@Component({
	selector: 'app-tournament-overview',
	templateUrl: './tournament-overview.component.html',
	styleUrls: ['./tournament-overview.component.scss']
})

export class TournamentOverviewComponent implements OnInit {
	constructor(public tournamentService: TournamentService) { }
	ngOnInit() { }
}
