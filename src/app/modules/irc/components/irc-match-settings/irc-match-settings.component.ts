import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';
import { WyMultiplayerLobbiesService } from '../../../../services/wy-multiplayer-lobbies.service';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { WebhookService } from '../../../../services/webhook.service';
import { SendBeatmapResultComponent } from '../../../../components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { WyTeamPlayer } from '../../../../models/wytournament/wy-team-player';
import { WyTeam } from '../../../../models/wytournament/wy-team';

@Component({
	selector: 'app-irc-match-settings',
	templateUrl: './irc-match-settings.component.html',
	styleUrl: './irc-match-settings.component.scss'
})
export class IrcMatchSettingsComponent {
	@ViewChild('teamMode') teamMode: MatSelect;
	@ViewChild('winCondition') winCondition: MatSelect;
	@ViewChild('players') players: MatSelect;

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
		private dialog: MatDialog,
		private router: Router,
		private toastService: ToastService,
		private webhookService: WebhookService,
		private ircService: IrcService,
		private multiplayerLobbies: WyMultiplayerLobbiesService
	) {
		this.sidebarHeaderButtonActive = 3;
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

	navigateLobbyOverview() {
		const lobbyId = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name).lobbyId;

		if (lobbyId) {
			this.router.navigate(['/lobby-overview/lobby-view', lobbyId]);
		}
		else {
			this.toastService.addToast('No lobby overview found for this irc channel');
		}
	}

	sendAddRefCommand() {
		this.ircService.sendMessage(this.selectedChannel.name, `!mp addref ${this.selectedLobby.tournament.addrefUsernames}`);
	}

	sendMatchSummary() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);

		if (selectedMultiplayerLobby.sendWebhooks != true) {
			return;
		}

		this.webhookService.sendMatchSummary(selectedMultiplayerLobby, this.ircService.authenticatedUser);
	}

	sendMatchResult() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);

		this.dialog.open(SendBeatmapResultComponent, {
			data: {
				multiplayerLobby: selectedMultiplayerLobby,
				ircChannel: this.selectedChannel.name
			}
		});
	}

	onRoomSettingChange() {
		if (!this.roomSettingGoingOn) {
			const timer =
				setInterval(() => {
					if (this.roomSettingDelay == 1) {
						this.ircService.sendMessage(this.selectedChannel.name, `!mp set ${this.teamMode.value as string} ${this.winCondition.value as string} ${this.players.value == undefined ? 8 : this.players.value as string}`);

						this.ircService.getChannelByName(this.selectedChannel.name).teamMode = this.teamMode.value;
						this.ircService.getChannelByName(this.selectedChannel.name).winCondition = this.winCondition.value;
						this.ircService.getChannelByName(this.selectedChannel.name).players = this.players.value;

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
