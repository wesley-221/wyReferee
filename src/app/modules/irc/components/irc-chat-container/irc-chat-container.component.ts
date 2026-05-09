import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { ElectronService } from '../../../../services/electron.service';
import { MultiplayerLobbyPlayersService } from '../../../../services/multiplayer-lobby-players.service';
import { IrcMessage } from '../../../../models/irc/irc-message';
import { MessageBuilder } from '../../../../models/irc/message-builder';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
	selector: 'app-irc-chat-container',
	templateUrl: './irc-chat-container.component.html',
	styleUrl: './irc-chat-container.component.scss'
})
export class IrcChatContainerComponent {
	@ViewChild('normalChatVirtualScroller') normalChatVirtualScroller: CdkVirtualScrollViewport;

	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;
	@Input() normalChats: IrcMessage[] = [];

	@Output() pickBeatmapFromAcronymEmitter = new EventEmitter<MessageBuilder>();
	@Output() adjustScoreEmitter = new EventEmitter<{ team: number, mouseClick: string }>();

	constructor(
		public ircService: IrcService,
		public electronService: ElectronService,
		public multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService
	) { }

	/**
	 * Open the link to the users userpage
	 *
	 * @param username
	 */
	openUserpage(username: string) {
		this.electronService.openLink(`https://osu.ppy.sh/users/${username}`);
	}

	/**
	 * Pick a beatmap from the given acronym typed in irc (HR1/MM2/DT3/etc.)
	 *
	 * @param chatPiece a MessageBuilder from irc to pick the map
	 */
	pickBeatmapFromAcronym(chatPiece: MessageBuilder) {
		this.pickBeatmapFromAcronymEmitter.emit(chatPiece);
	}

	scrollToBottom() {
		if (this.normalChatVirtualScroller != null) {
			this.normalChatVirtualScroller.scrollToIndex(this.normalChats.length - 1);
		}
	}

	adjustScore(team: number, mouseClick: string) {
		this.adjustScoreEmitter.emit({ team, mouseClick });
	}
}
