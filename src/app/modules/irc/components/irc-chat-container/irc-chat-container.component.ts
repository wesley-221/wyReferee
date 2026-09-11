import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { ElectronService } from '../../../../services/electron.service';
import { MultiplayerLobbyPlayersService } from '../../../../services/multiplayer-lobby-players.service';
import { IrcMessage } from '../../../../models/irc/irc-message';
import { MessageBuilder } from '../../../../models/irc/message-builder';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GenericService } from '../../../../services/generic.service';
import { BehaviorSubject, combineLatest, map, take } from 'rxjs';
import { IMatchActionData } from '../../../../interfaces/i-match-action-data';

@Component({
	selector: 'app-irc-chat-container',
	templateUrl: './irc-chat-container.component.html',
	styleUrl: './irc-chat-container.component.scss'
})
export class IrcChatContainerComponent implements OnInit {
	@ViewChild('normalChatVirtualScroller') normalChatVirtualScroller: CdkVirtualScrollViewport;
	@ViewChild('banchoBotVirtualScroller') banchoBotVirtualScroller: CdkVirtualScrollViewport;

	@Input()
	set selectedLobby(value: Lobby) {
		this.selectedLobby$.next(value);
	}
	@Input() selectedChannel: IrcChannel;
	@Input() normalChats: IrcMessage[] = [];
	@Input() banchoBotChats: IrcMessage[] = [];

	@Output() selectFromAcronymEmitter = new EventEmitter<{ chatPiece: MessageBuilder, currentAction: IMatchActionData }>();
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

				const currentAction = selectedLobby.getMatchAction(
					teamOneBans,
					teamTwoBans,
					teamOneProtects,
					teamTwoProtects,
					nextPick
				);

				return {
					...matchStatus,
					currentAction
				};
			})
		);

	splitBanchoBotMessages$ = this.genericService.getSplitBanchoBotMessagesStatus();
	switchChatContainers$ = this.genericService.getChatContainerSwitchStatus();
	topHeight = 30;

	private resizing = false;
	private animationFrame: number | null = null;
	private latestEvent: PointerEvent | null = null;

	constructor(
		public ircService: IrcService,
		public electronService: ElectronService,
		public multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService,
		private genericService: GenericService
	) { }

	ngOnInit() {
		this.genericService.getBanchoChatContainerHeight()
			.pipe(take(1))
			.subscribe(height => this.topHeight = height);
	}

	/**
	 * Open the link to the users userpage
	 *
	 * @param username
	 */
	openUserpage(username: string) {
		this.electronService.openLink(`https://osu.ppy.sh/users/${username}`);
	}

	/**
	 * Pick, ban or protect a beatmap from the given acronym typed in irc (HR1/MM2/DT3/etc.)
	 *
	 * @param chatPiece a MessageBuilder from irc to pick, ban or protect the map
	 * @param currentAction the current action based on the lobby progression
	 */
	selectFromAcronym(chatPiece: MessageBuilder, currentAction: IMatchActionData) {
		this.selectFromAcronymEmitter.emit({ chatPiece, currentAction });
	}

	scrollToBottom() {
		if (this.normalChatVirtualScroller != null) {
			this.normalChatVirtualScroller.scrollToIndex(this.normalChats.length - 1);
		}

		if (this.banchoBotVirtualScroller != null) {
			this.banchoBotVirtualScroller.scrollToIndex(this.banchoBotChats.length - 1);
		}
	}

	adjustScore(team: number, mouseClick: string) {
		this.adjustScoreEmitter.emit({ team, mouseClick });
	}

	startResize(event: PointerEvent): void {
		event.preventDefault();

		this.resizing = true;

		document.addEventListener('pointermove', this.onResize);
		document.addEventListener('pointerup', this.stopResize);
		document.body.classList.add('resizing-chat-container');
	}

	private onResize = (event: PointerEvent): void => {
		if (!this.resizing) {
			return;
		}

		this.latestEvent = event;

		if (this.animationFrame !== null) {
			return;
		}

		this.animationFrame = requestAnimationFrame(() => {
			this.animationFrame = null;

			if (!this.latestEvent) {
				return;
			}

			const container = document.querySelector('.chat-container');

			if (!container) {
				return;
			}

			const rect = container.getBoundingClientRect();
			const offsetY = this.latestEvent.clientY - rect.top;
			let percentage = (offsetY / rect.height) * 100;

			if (this.switchChatContainers$.value) {
				percentage = 100 - percentage;
			}

			percentage = Math.max(10, Math.min(90, percentage));

			this.topHeight = percentage;
		});
	};

	private stopResize = (): void => {
		this.resizing = false;

		document.body.classList.remove('resizing-chat-container');

		document.removeEventListener(
			'pointermove',
			this.onResize
		);

		document.removeEventListener(
			'pointerup',
			this.stopResize
		);

		if (this.animationFrame !== null) {
			cancelAnimationFrame(this.animationFrame);

			this.animationFrame = null;
		}

		this.genericService.setBanchoChatContainerHeight(this.topHeight);
		this.scrollToBottom();
	};
}
