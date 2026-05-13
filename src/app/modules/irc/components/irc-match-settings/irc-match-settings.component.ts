import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
	@ViewChild('teamMode') teamMode: ElementRef;
	@ViewChild('winCondition') winCondition: ElementRef;
	@ViewChild('players') players: ElementRef;

	@Output() openLobbyDialogEmitter = new EventEmitter<void>();
	@Output() synchronizeMpEmitter = new EventEmitter<void>()
	@Output() updateMatchResultsEmitter = new EventEmitter<void>();

	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;
	@Input() qualifierTeams: WyTeam[];

	sidebarHeaderButtonActive: number;
	roomSettingGoingOn: boolean;
	roomSettingDelay: number;

	constructor(
		private toastService: ToastService,
		private ircService: IrcService
	) {
		this.sidebarHeaderButtonActive = 1;
		this.roomSettingGoingOn = false;
		this.roomSettingDelay = 0;
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

	onRoomSettingChange() {
		if (!this.roomSettingGoingOn) {
			const timer =
				setInterval(() => {
					if (this.roomSettingDelay == 1) {
						this.ircService.sendMessage(this.selectedChannel.name, `!mp set ${this.teamMode.nativeElement.value as string} ${this.winCondition.nativeElement.value as string} ${this.players.nativeElement.value == undefined ? 8 : this.players.nativeElement.value as string}`);

						this.ircService.getChannelByName(this.selectedChannel.name).teamMode = this.teamMode.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.name).winCondition = this.winCondition.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.name).players = this.players.nativeElement.value;

						this.roomSettingGoingOn = false;
						this.roomSettingDelay = 0;

						clearInterval(timer);
					}

					this.roomSettingDelay--;
				}, 1000);

			this.roomSettingGoingOn = true;
		}

		this.roomSettingDelay = 3;
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
