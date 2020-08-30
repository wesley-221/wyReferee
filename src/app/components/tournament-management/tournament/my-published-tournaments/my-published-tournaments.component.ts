import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../models/tournament/tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { AuthenticateService } from '../../../../services/authenticate.service';

@Component({
	selector: 'app-my-published-tournaments',
	templateUrl: './my-published-tournaments.component.html',
	styleUrls: ['./my-published-tournaments.component.scss']
})

export class MyPublishedTournamentsComponent implements OnInit {
	publishedTournaments: Tournament[] = [];

	constructor(private tournamentService: TournamentService, private authService: AuthenticateService) {
		this.tournamentService.getAllPublishedTournamentsFromUser(authService.loggedInUser).subscribe(data => {
			for (const tournament in data) {
				const newTournament: Tournament = this.tournamentService.mapFromJson(data[tournament]);
				this.publishedTournaments.push(newTournament);
			}
		});
	}
	ngOnInit(): void { }
}
