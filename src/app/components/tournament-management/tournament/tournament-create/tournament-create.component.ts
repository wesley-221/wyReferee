import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../models/tournament/tournament';
import { TournamentService } from '../../../../services/tournament.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})

export class TournamentCreateComponent implements OnInit {
	tournamentCreate: Tournament;

	constructor(private tournamentService: TournamentService, private toastService: ToastService) {
		this.tournamentCreate = new Tournament();
	}

	ngOnInit() { }

	/**
	 * Create the tournament
	 */
	createTournament() {
		this.tournamentService.saveTournament(this.tournamentCreate);
		this.toastService.addToast(`Successfully created the tournament "${this.tournamentCreate.tournamentName}" with a total of ${this.tournamentCreate.getTeams().length} team(s).`);

		this.tournamentCreate = new Tournament();
	}
}
