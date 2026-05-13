import { Component, Input } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { WyTeamPlayer } from '../../../../models/wytournament/wy-team-player';
import { IrcService } from '../../../../services/irc.service';
import { ToastService } from '../../../../services/toast.service';
import { WyTeam } from '../../../../models/wytournament/wy-team';

@Component({
	selector: 'app-irc-match-settings-players-invite',
	templateUrl: './irc-match-settings-players-invite.component.html',
	styleUrl: './irc-match-settings-players-invite.component.scss'
})
export class IrcMatchSettingsPlayersInviteComponent {
	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;
	@Input() qualifierTeams: WyTeam[];

	constructor(
		private ircService: IrcService,
		private toastService: ToastService
	) { }

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
