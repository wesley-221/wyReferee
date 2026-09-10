import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
	selector: 'app-irc-match-header',
	templateUrl: './irc-match-header.component.html',
	styleUrl: './irc-match-header.component.scss'
})
export class IrcMatchHeaderComponent {
	@Input()
	set selectedLobby(value: Lobby) {
		this.selectedLobby$.next(value);
	}
	@Input() selectedChannel: IrcChannel;
	@Output() adjustScoreEmitter = new EventEmitter<{ team: number, mouseClick: string }>();

	selectedLobby$ = new BehaviorSubject<Lobby>(null);

	matchStatus$ = combineLatest([
		this.selectedLobby$,
		this.ircService.nextPick$,
		this.ircService.matchPoint$,
		this.ircService.tiebreaker$,
		this.ircService.hasWon$,
		this.ircService.teamOneScore$,
		this.ircService.teamTwoScore$,
		this.ircService.teamOneBans$,
		this.ircService.teamTwoBans$,
		this.ircService.teamOneProtects$,
		this.ircService.teamTwoProtects$
	])
		.pipe(
			map(([
				selectedLobby, nextPick, matchPoint, tiebreaker, hasWon,
				teamOneScore, teamTwoScore,
				teamOneBans, teamTwoBans,
				teamOneProtects, teamTwoProtects
			]) => {
				const matchStatus = {
					nextPick,
					matchPoint,
					tiebreaker,
					hasWon,
					teamOneScore,
					teamTwoScore,
					teamOneBans,
					teamTwoBans,
					teamOneProtects,
					teamTwoProtects
				};

				const teamOneProtectCount = teamOneProtects.length;
				const teamTwoProtectCount = teamTwoProtects.length;

				const teamOneBanCount = teamOneBans.length;
				const teamTwoBanCount = teamTwoBans.length;

				let currentAction = {
					team: null,
					action: null,
					color: null
				};

				if (selectedLobby.tournament) {
					const firstProtect = selectedLobby.firstProtect;
					const secondProtect = this.getOtherTeam(selectedLobby, firstProtect);

					const firstBan = selectedLobby.firstBan;
					const secondBan = this.getOtherTeam(selectedLobby, firstBan);

					if (selectedLobby.tournament.protects == true) {
						if (teamOneProtectCount < selectedLobby.selectedStage.protects || teamTwoProtectCount < selectedLobby.selectedStage.protects) {
							currentAction = {
								team: teamOneProtectCount === teamTwoProtectCount ? firstProtect : secondProtect,
								action: 'protects',
								color: teamOneProtectCount === teamTwoProtectCount ? 'blue' : 'red'
							};
						}
						else if (teamOneBanCount < selectedLobby.selectedStage.bans || teamTwoBanCount < selectedLobby.selectedStage.bans) {
							currentAction = {
								team: teamOneBanCount === teamTwoBanCount ? firstBan : secondBan,
								action: 'bans',
								color: teamOneBanCount === teamTwoBanCount ? 'blue' : 'red'
							};
						}
						else {
							currentAction = {
								team: nextPick,
								action: 'picks',
								color: nextPick === selectedLobby.teamOneName ? 'blue' : 'red'
							};
						}
					}
					else {
						if (teamOneBanCount < selectedLobby.selectedStage.bans || teamTwoBanCount < selectedLobby.selectedStage.bans) {
							currentAction = {
								team: teamOneBanCount === teamTwoBanCount ? firstBan : secondBan,
								action: 'bans',
								color: teamOneBanCount === teamTwoBanCount ? 'blue' : 'red'
							};
						}
						else {
							currentAction = {
								team: nextPick,
								action: 'picks',
								color: nextPick === selectedLobby.teamOneName ? 'blue' : 'red'
							};
						}
					}
				}
				else {
					currentAction = {
						team: nextPick,
						action: 'picks',
						color: nextPick === selectedLobby.teamOneName ? 'blue' : 'red'
					};
				}

				return {
					...matchStatus,
					currentAction
				};
			})
		);

	constructor(
		private ircService: IrcService
	) { }

	adjustScore(team: number, event: MouseEvent) {
		if (event.button == 0) {
			this.adjustScoreEmitter.emit({ team, mouseClick: 'left' });
		}
		else if (event.button == 1) {
			this.adjustScoreEmitter.emit({ team, mouseClick: 'middle' });
		}
		else if (event.button == 2) {
			this.adjustScoreEmitter.emit({ team, mouseClick: 'right' });
		}
	}

	getOtherTeam(lobby: Lobby, teamName: string) {
		return lobby.teamOneName == teamName ? lobby.teamTwoName : lobby.teamOneName;
	}
}
