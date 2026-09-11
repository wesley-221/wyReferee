import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMatchActionData } from '../../../../interfaces/i-match-action-data';

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
	@Input() matchStatus$: Observable<{
		currentAction: IMatchActionData;
		nextPick: string;
		matchPoint: string;
		tiebreaker: boolean;
		hasWon: string;
		teamOneScore: number;
		teamTwoScore: number;
		teamOneBans: number[];
		teamTwoBans: number[];
		teamOneProtects: number[];
		teamTwoProtects: number[];
	}>;
	@Output() adjustScoreEmitter = new EventEmitter<{ team: number, mouseClick: string }>();

	selectedLobby$ = new BehaviorSubject<Lobby>(null);


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
