import { Component, OnDestroy, OnInit } from '@angular/core';
import { WyTriggerMessage } from 'app/models/wytournament/trigger-message';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { ManagementSidebarService } from '../../services/management-sidebar.service';
import { TournamentEditStateService } from '../../services/tournament-edit-state.service';
import { take } from 'rxjs';
import { ToastType } from '../../../../models/toast';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})
export class TournamentCreateComponent implements OnInit, OnDestroy {
	tournament: WyTournament;

	constructor(
		private toastService: ToastService,
		private tournamentService: TournamentService,
		private tournamentEditStateService: TournamentEditStateService,
		private managementSidebarService: ManagementSidebarService
	) {
		this.tournament = new WyTournament();

		const triggerMessages = [
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: '{{ beatmapWinner }} has won on {{ beatmap }}', beatmapResult: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: 'Score: {{ beatmapTeamOneScore }} - {{ beatmapTeamTwoScore }} | score difference : {{ scoreDifference }}', beatmapResult: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: '{{ teamOneName }} | {{ matchTeamOneScore }} : {{ matchTeamTwoScore }} | {{ teamTwoName }}', beatmapResult: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: 'Next pick is for {{ nextPick }}', beatmapResult: true, nextPickMessage: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: 'The next pick is the tiebreaker!', beatmapResult: true, nextPickTiebreakerMessage: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: '!mp aborttimer', beatmapPicked: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: '!mp timer 120', beatmapPicked: true }),
			new WyTriggerMessage({ index: this.tournament.triggerMessageIndex++, message: '{{ matchWinner }} has won the match, GG and WP!', beatmapResult: true, matchWonMessage: true })
		];

		for (const triggerMessage of triggerMessages) {
			this.tournament.triggerMessages.push(triggerMessage);
		}

		this.tournamentEditStateService.setInitialTournament(this.tournament);
		this.managementSidebarService.setTournament(this.tournament);
		this.managementSidebarService.setTournamentManagementItems('create');
	}

	ngOnInit(): void {
		this.managementSidebarService.setTournament(this.tournament);
		this.managementSidebarService.setTournamentManagementItems('create');
	}

	ngOnDestroy(): void {
		this.managementSidebarService.setDefaultItems();
	}

	createTournament(): void {
		this.tournamentEditStateService.pageState$
			.pipe(
				take(1)
			)
			.subscribe(pageState => {
				if (pageState.totalErrorCount > 0) {
					this.toastService.addToast(`Unable to update the tournament. Please fix all errors before saving.`, ToastType.Error);
					return;
				}

				this.tournamentService.createTournament(this.tournament);

				this.toastService.addToast('Successfully created the tournament.');
			});

	}
}
