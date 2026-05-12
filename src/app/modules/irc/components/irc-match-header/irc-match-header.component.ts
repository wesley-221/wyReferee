import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { combineLatest, map } from 'rxjs';

@Component({
	selector: 'app-irc-match-header',
	templateUrl: './irc-match-header.component.html',
	styleUrl: './irc-match-header.component.scss'
})
export class IrcMatchHeaderComponent {
	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;

	@Output() adjustScoreEmitter = new EventEmitter<{ team: number, mouseClick: string }>();

	matchStatus$ = combineLatest([
		this.ircService.nextPick$,
		this.ircService.matchPoint$,
		this.ircService.tiebreaker$,
		this.ircService.hasWon$,
		this.ircService.teamOneScore$,
		this.ircService.teamTwoScore$
	])
		.pipe(
			map(([nextPick, matchPoint, tiebreaker, hasWon, teamOneScore, teamTwoScore]) => ({
				nextPick,
				matchPoint,
				tiebreaker,
				hasWon,
				teamOneScore,
				teamTwoScore
			}))
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
}
