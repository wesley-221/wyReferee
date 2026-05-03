import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { ManagementSidebarService } from '../../services/management-sidebar.service';
import { TournamentEditStateService } from '../../services/tournament-edit-state.service';
import { take } from 'rxjs';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})
export class TournamentEditComponent implements OnInit, OnDestroy {
	tournament: WyTournament;
	isPublishedTournament: boolean;

	constructor(
		private route: ActivatedRoute,
		private tournamentService: TournamentService,
		private lobbyService: WyMultiplayerLobbiesService,
		private toastService: ToastService,
		private managementSidebarService: ManagementSidebarService,
		private tournamentEditStateService: TournamentEditStateService
	) { }

	ngOnInit(): void {
		this.route.params
			.pipe(
				take(1)
			)
			.subscribe(params => {
				this.isPublishedTournament = parseInt(params.published) == 0 ? false : true;
				const tournamentId = parseInt(params.id);

				if (this.isPublishedTournament == false) {
					this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
						if (initialized == true) {
							const tournament = WyTournament.makeTrueCopy(this.tournamentService.getTournamentById(params.id));

							this.tournamentEditStateService.setInitialTournament(tournament);
							this.managementSidebarService.setTournament(tournament);
							this.managementSidebarService.setTournamentManagementItems(this.isPublishedTournament == true ? 'published' : 'local');

							this.tournament = tournament;
						}
					});
				}
				else if (this.isPublishedTournament == true) {
					this.tournamentService.getPublishedTournament(tournamentId).subscribe(publishedTournament => {
						const tournament = WyTournament.makeTrueCopy(publishedTournament);
						tournament.publishId = tournament.id;

						this.tournamentEditStateService.setInitialTournament(tournament);
						this.managementSidebarService.setTournament(tournament);
						this.managementSidebarService.setTournamentManagementItems(this.isPublishedTournament == true ? 'published' : 'local');

						this.tournament = tournament;
					});
				}
			});
	}

	ngOnDestroy(): void {
		this.managementSidebarService.setDefaultItems();
	}

	/**
	 * Update the current tournament
	 */
	updateTournament(): void {
		this.tournamentEditStateService.pageState$
			.pipe(
				take(1)
			)
			.subscribe(pageState => {
				if (pageState.totalErrorCount > 0) {
					this.toastService.addToast(`Unable to update the tournament. Please fix all errors before saving.`, ToastType.Error);
					return;
				}

				if (this.isPublishedTournament == false) {
					this.tournamentService.updateTournament(this.tournament, this.tournament.id);

					for (const lobby in this.lobbyService.allLobbies) {
						if (this.lobbyService.allLobbies[lobby].tournamentId == this.tournament.id) {
							this.lobbyService.allLobbies[lobby].tournament = this.tournament;
						}
					}

					this.toastService.addToast(`Successfully updated ${this.tournament.name}.`);
				}
				else if (this.isPublishedTournament == true) {
					this.tournamentService.updatePublishedTournament(this.tournament).subscribe(tournament => {
						this.toastService.addToast(`Successfully updated ${tournament.name}.`);
					}, error => {
						this.toastService.addToast(`Unable to update the tournament: ${error.error.message as string}`, ToastType.Error);
					});
				}
			});
	}
}
