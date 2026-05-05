import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';

@Component({
	selector: 'app-irc-match-header',
	templateUrl: './irc-match-header.component.html',
	styleUrl: './irc-match-header.component.scss'
})
export class IrcMatchHeaderComponent {
	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;

	@Input() teamOneScore: number;
	@Input() teamTwoScore: number;

	@Input() tiebreaker: boolean;
	@Input() hasWon: string;
	@Input() nextPick: string;
	@Input() matchpoint: string;

	@Output() adjustScoreEmitter = new EventEmitter<{ team: number, mouseClick: string }>();

	adjustScore(team: number, mouseClick: string) {
		this.adjustScoreEmitter.emit({ team, mouseClick });
	}
}
