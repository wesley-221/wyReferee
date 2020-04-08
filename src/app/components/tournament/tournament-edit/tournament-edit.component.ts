import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentService } from '../../../services/tournament.service';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})

export class TournamentEditComponent implements OnInit {
	tournamentEdit: Tournament;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService) {
		this.route.params.subscribe(params => {
			this.tournamentEdit = tournamentService.getTournamentById(params.tournamentId);

			console.log(this.tournamentEdit)
		});
	}

	ngOnInit() { }
}
