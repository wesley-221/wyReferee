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

				const protectCount = (teamOneProtects?.length || 0) + (teamTwoProtects?.length || 0);
				const banCount = (teamOneBans?.length || 0) + (teamTwoBans?.length || 0);

				let currentAction = {
					team: null,
					action: null
				};

				if (selectedLobby.tournament) {
					const totalBans = selectedLobby.selectedStage.bans;

					// TODO: change this once protects are implemented for stages
					const totalProtects = 2; /* selectedLobby.selectedStage.protects; */

					if (selectedLobby.tournament.protects == true) {
						// TODO: same as above, implement protects/bans/picks once it has been implemented for stages
						// if (protectCount < totalProtects) {
						// 	// currentAction = {
						// 	// 	team: protectCount === 0 ? selectedLobby.first
						// 	// }
						// }
					}
					else {
						if (banCount < totalBans) {
							currentAction = {
								team: banCount === 0 ? selectedLobby.firstBan : this.getOtherTeam(selectedLobby, selectedLobby.firstBan),
								action: 'bans'
							}
						}
						else {
							currentAction = {
								team: nextPick,
								action: 'picks'
							}
						}
					}
				}
				else {
					currentAction = {
						team: nextPick,
						action: 'picks'
					}
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
