import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { WyTeam } from '../../../../models/wytournament/wy-team';

@Component({
	selector: 'app-irc-match-settings',
	templateUrl: './irc-match-settings.component.html',
	styleUrl: './irc-match-settings.component.scss'
})
export class IrcMatchSettingsComponent {
	@Output() openLobbyDialogEmitter = new EventEmitter<void>();
	@Output() synchronizeMpEmitter = new EventEmitter<void>()
	@Output() updateMatchResultsEmitter = new EventEmitter<void>();

	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;
	@Input() qualifierTeams: WyTeam[];

	sidebarHeaderButtonActive: number;

	constructor() {
		this.sidebarHeaderButtonActive = 1;
	}

	selectSidebarHeaderButton(button: number): void {
		this.sidebarHeaderButtonActive = button;
	}

	openLobbyDialog() {
		this.openLobbyDialogEmitter.emit();
	}

	synchronizeMp() {
		this.synchronizeMpEmitter.emit();
	}

	updateMatchResults() {
		this.updateMatchResultsEmitter.emit();
	}
}
