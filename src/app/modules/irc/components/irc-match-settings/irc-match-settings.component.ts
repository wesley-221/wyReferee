import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { ToastService } from '../../../../services/toast.service';
import { WyTeamPlayer } from '../../../../models/wytournament/wy-team-player';
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

	constructor(
		private toastService: ToastService,
		private ircService: IrcService
	) {
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

	/**
	 * Invite a player to the current multiplayer lobby
	 *
	 * @param player the player to invite
	 */
	invitePlayer(player: WyTeamPlayer): void {
		if (player.userId == null || player.userId == undefined) {
			this.ircService.sendMessage(this.selectedChannel.name, `!mp invite ${player.name}`);
		}
		else {
			this.ircService.sendMessage(this.selectedChannel.name, `!mp invite #${player.userId}`);
		}

		this.toastService.addToast(`Invited ${player.name} to the multiplayer lobby.`);
	}

	/**
	 * Opens a dm channel with the given player
	 *
	 * @param player the player to open the dm channel for
	 */
	openDMChannel(player: WyTeamPlayer): void {
		this.ircService.joinChannel(player.name);
	}
}
