import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentService } from '../../../services/tournament.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})

export class TournamentEditComponent implements OnInit {
	originalTournament: Tournament;
	tournamentEdit: Tournament;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private toastService: ToastService) {
		this.route.params.subscribe(params => {
			this.originalTournament = tournamentService.getTournamentById(params.tournamentId);
			this.tournamentEdit = Tournament.makeTrueCopy(this.originalTournament);
		});
	}

	ngOnInit() { }

	/**
	 * Create the tournament
	 */
	udpateTournament() {
		this.tournamentService.updateTournament(this.originalTournament, this.tournamentEdit);
		this.toastService.addToast(`Successfully updated the tournament "${this.tournamentEdit.tournamentName}".`);
	}
}
