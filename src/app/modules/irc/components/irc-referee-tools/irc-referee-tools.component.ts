import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { WyMultiplayerLobbiesService } from '../../../../services/wy-multiplayer-lobbies.service';
import { IrcService } from '../../../../services/irc.service';
import { WebhookService } from '../../../../services/webhook.service';
import { SendBeatmapResultComponent } from '../../../../components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-irc-referee-tools',
	templateUrl: './irc-referee-tools.component.html',
	styleUrls: ['./irc-referee-tools.component.scss']
})
export class IrcRefereeToolsComponent {
	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;

	@Output() openLobbyDialogEmitter = new EventEmitter<void>();
	@Output() synchronizeMpEmitter = new EventEmitter<void>()
	@Output() updateMatchResultsEmitter = new EventEmitter<void>();

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private toastService: ToastService,
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private ircService: IrcService,
		private webhookService: WebhookService
	) { }

	openLobbyDialog() {
		this.openLobbyDialogEmitter.emit();
	}

	synchronizeMp() {
		this.synchronizeMpEmitter.emit();
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

	updateMatchResults() {
		this.updateMatchResultsEmitter.emit();
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
}
