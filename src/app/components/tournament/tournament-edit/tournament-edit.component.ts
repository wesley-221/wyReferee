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
	publish: any;
	tournament: Tournament;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private toastService: ToastService) {
		this.route.params.subscribe(params => {
			this.publish = params.publish;

			if (this.publish == true || this.publish == 'true') {
				this.tournamentService.getPublishedTournament(params.tournamentId).subscribe(data => {
					this.tournament = tournamentService.mapFromJson(data);

					// Collapse all teams
					for (const team in this.tournament.teams) {
						this.tournament.teams[team].collapsed = true;
					}
				});
			}
			else {
				this.tournament = Tournament.makeTrueCopy(tournamentService.getTournament(params.tournamentId));

				// Collapse all teams
				for (const team in this.tournament.teams) {
					this.tournament.teams[team].collapsed = true;
				}
			}
		});
	}

	ngOnInit() { }

	/**
	 * Create the tournament
	 */
	udpateTournament(tournament: Tournament): void {
		if (this.publish == true || this.publish == 'true') {
			this.tournamentService.updatePublishedTournament(tournament).subscribe(() => {
				this.toastService.addToast(`Successfully updated the mappool "${tournament.tournamentName}".`);
			});
		}
		else {
			this.tournamentService.updateTournament(this.tournament);
			this.toastService.addToast(`Successfully updated the mappool "${tournament.tournamentName}".`);
		}
	}
}
